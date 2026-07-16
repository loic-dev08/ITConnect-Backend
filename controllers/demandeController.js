const { Demande, Professionnel, User } = require('../models')

async function getDemandes(req, res, next) {
  try {
    let demandes
    if (req.user.role === 'professionnel') {
      const pro = await Professionnel.findOne({ where: { userId: req.user.id } })
      if (!pro) return res.status(404).json({ message: 'Profil introuvable.' })
      demandes = await Demande.findAll({
        where: { professionnelId: pro.id },
        include: [{ model: User, as: 'client', attributes: ['prenom', 'nom', 'email', 'role', 'ville'] }],
        order: [['created_at', 'DESC']],
      })
    } else {
      demandes = await Demande.findAll({
        where: { clientId: req.user.id },
        include: [{ model: Professionnel, as: 'professionnel',
          include: [{ model: User, as: 'user', attributes: ['prenom', 'nom'] }] }],
        order: [['created_at', 'DESC']],
      })
    }
    res.json({ demandes })
  } catch (error) { next(error) }
}

async function createDemande(req, res, next) {
  try {
    const { professionnelId, objet, message } = req.body
    const pro = await Professionnel.findByPk(professionnelId)
    if (!pro) return res.status(404).json({ message: 'Professionnel introuvable.' })
    if (pro.userId === req.user.id)
      return res.status(400).json({ message: 'Vous ne pouvez pas vous envoyer une demande.' })
    const demande = await Demande.create({ clientId: req.user.id, professionnelId, objet, message })
    res.status(201).json({ message: 'Demande envoyée.', demande })
  } catch (error) { next(error) }
}

async function getDemandeById(req, res, next) {
  try {
    const demande = await Demande.findByPk(req.params.id, {
      include: [
        { model: User, as: 'client', attributes: ['prenom', 'nom', 'email'] },
        { model: Professionnel, as: 'professionnel' },
      ],
    })
    if (!demande) return res.status(404).json({ message: 'Demande introuvable.' })
    const pro = await Professionnel.findOne({ where: { userId: req.user.id } })
    if (demande.clientId !== req.user.id && (!pro || demande.professionnelId !== pro.id) && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Accès interdit.' })
    res.json({ demande })
  } catch (error) { next(error) }
}

async function updateStatut(req, res, next) {
  try {
    const { statut } = req.body
    const demande = await Demande.findByPk(req.params.id)
    if (!demande) return res.status(404).json({ message: 'Demande introuvable.' })
    const pro = await Professionnel.findOne({ where: { userId: req.user.id } })
    if (!pro || demande.professionnelId !== pro.id)
      return res.status(403).json({ message: 'Accès interdit.' })
    const transitions = { 'En attente': ['En cours', 'Refusée'], 'En cours': ['Terminée'] }
    if (!(transitions[demande.statut] || []).includes(statut))
      return res.status(400).json({ message: `Transition "${demande.statut}" → "${statut}" invalide.` })
    await demande.update({ statut })
    if (statut === 'Terminée') await pro.increment('nombre_missions')
    res.json({ message: 'Statut mis à jour.', demande })
  } catch (error) { next(error) }
}

module.exports = { getDemandes, createDemande, getDemandeById, updateStatut }