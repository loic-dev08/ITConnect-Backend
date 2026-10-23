const jwt                      = require('jsonwebtoken')
const { User, Professionnel }  = require('../models')

// Rôles qu'un utilisateur peut choisir lui-même à l'inscription.
// "admin" est volontairement absent : il ne peut pas être attribué via l'API.
const ROLES_AUTORISES = ['particulier', 'entreprise', 'professionnel']

// Même règle que le formulaire front : 8 caractères min., 1 majuscule, 1 chiffre
const REGEX_MOT_DE_PASSE = /^(?=.*[A-Z])(?=.*\d).{8,}$/

function genererToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })
}

async function inscription(req, res, next) {
  try {
    const { prenom, nom, email, motDePasse, role } = req.body

    if (!prenom || !nom || !email || !motDePasse)
      return res.status(400).json({ message: 'Tous les champs sont obligatoires.' })
    if (!REGEX_MOT_DE_PASSE.test(motDePasse))
      return res.status(400).json({
        message: 'Le mot de passe doit contenir 8 caractères minimum, 1 majuscule et 1 chiffre.',
      })

    // Liste blanche : tout rôle inconnu ou "admin" devient "particulier"
    const roleFinal = ROLES_AUTORISES.includes(role) ? role : 'particulier'

    const existant = await User.findOne({ where: { email } })
    if (existant) return res.status(409).json({ message: 'Email déjà utilisé.' })

    const user = await User.create({ prenom, nom, email, motDePasse, role: roleFinal })
    if (roleFinal === 'professionnel')
      await Professionnel.create({ userId: user.id, specialite: 'À compléter', ville: '' })

    const token = genererToken(user.id)
    res.status(201).json({ message: 'Compte créé.', token, user: user.toJSON() })
  } catch (error) { next(error) }
}

async function connexion(req, res, next) {
  try {
    const { email, motDePasse } = req.body
    if (!email || !motDePasse)
      return res.status(400).json({ message: 'Email et mot de passe obligatoires.' })

    const user = await User.findOne({ where: { email } })
    if (!user) return res.status(401).json({ message: 'Email ou mot de passe incorrect.' })
    const mdpValide = await user.verifierMotDePasse(motDePasse)
    if (!mdpValide) return res.status(401).json({ message: 'Email ou mot de passe incorrect.' })
    const token = genererToken(user.id)
    res.json({ message: 'Connexion réussie.', token, user: user.toJSON() })
  } catch (error) { next(error) }
}

async function getMe(req, res, next) {
  try {
    res.json({ user: req.user.toJSON() })
  } catch (error) { next(error) }
}

async function updateMe(req, res, next) {
  try {
    // Seuls ces champs sont modifiables : le rôle ne peut pas être changé ici
    const { prenom, nom, email, ville } = req.body
    if (email && email !== req.user.email) {
      const existant = await User.findOne({ where: { email } })
      if (existant) return res.status(409).json({ message: 'Email déjà utilisé.' })
    }
    await req.user.update({ prenom, nom, email, ville })
    res.json({ message: 'Profil mis à jour.', user: req.user.toJSON() })
  } catch (error) { next(error) }
}

async function updateMotDePasse(req, res, next) {
  try {
    const { actuel, nouveau } = req.body
    if (!actuel || !nouveau)
      return res.status(400).json({ message: 'Mot de passe actuel et nouveau obligatoires.' })
    if (!REGEX_MOT_DE_PASSE.test(nouveau))
      return res.status(400).json({
        message: 'Le mot de passe doit contenir 8 caractères minimum, 1 majuscule et 1 chiffre.',
      })

    const mdpValide = await req.user.verifierMotDePasse(actuel)
    if (!mdpValide) return res.status(401).json({ message: 'Mot de passe actuel incorrect.' })
    await req.user.update({ motDePasse: nouveau })
    res.json({ message: 'Mot de passe modifié.' })
  } catch (error) { next(error) }
}

async function deleteMe(req, res, next) {
  try {
    await req.user.destroy()
    res.json({ message: 'Compte supprimé.' })
  } catch (error) { next(error) }
}

module.exports = { inscription, connexion, getMe, updateMe, updateMotDePasse, deleteMe }