const jwt                      = require('jsonwebtoken')
const { User, Professionnel }  = require('../models')

function genererToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })
}

async function inscription(req, res, next) {
  try {
    const { prenom, nom, email, motDePasse, role } = req.body
    const existant = await User.findOne({ where: { email } })
    if (existant) return res.status(409).json({ message: 'Email déjà utilisé.' })
    const user = await User.create({ prenom, nom, email, motDePasse, role })
    if (role === 'professionnel')
      await Professionnel.create({ userId: user.id, specialite: 'À compléter', ville: '' })
    const token = genererToken(user.id)
    res.status(201).json({ message: 'Compte créé.', token, user: user.toJSON() })
  } catch (error) { next(error) }
}

async function connexion(req, res, next) {
  try {
    const { email, motDePasse } = req.body
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