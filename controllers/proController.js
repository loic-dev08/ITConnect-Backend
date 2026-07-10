const { Professionnel, User, Avis } = require('../models')
const { Op }                         = require('sequelize')

async function getProfessionnels(req, res, next) {
  try {
    const { specialite, ville, dispo, noteMin, page = 1, limit = 12 } = req.query
    const where = {}
    if (specialite) where.specialite = { [Op.like]: `%${specialite}%` }
    if (ville)      where.ville      = { [Op.like]: `%${ville}%` }
    if (dispo !== undefined) where.disponible = dispo === 'true'
    if (noteMin) where.note_moyenne  = { [Op.gte]: parseFloat(noteMin) }
    const offset = (parseInt(page) - 1) * parseInt(limit)
    const { count, rows } = await Professionnel.findAndCountAll({
      where,
      include: [{ model: User, as: 'user', attributes: ['prenom', 'nom', 'email'] }],
      limit: parseInt(limit), offset,
      order: [['note_moyenne', 'DESC']],
    })
    res.json({ professionnels: rows, total: count, page: parseInt(page),
               totalPages: Math.ceil(count / parseInt(limit)) })
  } catch (error) { next(error) }
}

async function getProfessionnelById(req, res, next) {
  try {
    const pro = await Professionnel.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['prenom', 'nom', 'email'] },
        { model: Avis, as: 'avis',
          include: [{ model: User, as: 'client', attributes: ['prenom', 'nom'] }] },
      ],
    })
    if (!pro) return res.status(404).json({ message: 'Professionnel introuvable.' })
    res.json({ professionnel: pro })
  } catch (error) { next(error) }
}

async function updateProfilPro(req, res, next) {
  try {
    const pro = await Professionnel.findOne({ where: { userId: req.user.id } })
    if (!pro) return res.status(404).json({ message: 'Profil introuvable.' })
    await pro.update(req.body)
    res.json({ message: 'Profil mis à jour.', professionnel: pro })
  } catch (error) { next(error) }
}

module.exports = { getProfessionnels, getProfessionnelById, updateProfilPro }