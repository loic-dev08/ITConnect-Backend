const { Avis, Professionnel, User } = require('../models')
const { sequelize }                  = require('../config/database')

async function getAvis(req, res, next) {
  try {
    const avis = await Avis.findAll({
      where: { professionnelId: req.params.id },
      include: [{ model: User, as: 'client', attributes: ['prenom', 'nom'] }],
      order: [['created_at', 'DESC']],
    })
    res.json({ avis })
  } catch (error) { next(error) }
}

async function createAvis(req, res, next) {
  try {
    const { note, texte } = req.body
    const professionnelId = parseInt(req.params.id)
    const pro = await Professionnel.findByPk(professionnelId)
    if (!pro) return res.status(404).json({ message: 'Professionnel introuvable.' })
    if (pro.userId === req.user.id)
      return res.status(400).json({ message: 'Vous ne pouvez pas vous noter.' })
    const existant = await Avis.findOne({ where: { clientId: req.user.id, professionnelId } })
    if (existant) return res.status(409).json({ message: 'Avis déjà soumis.' })
    const avis = await Avis.create({ clientId: req.user.id, professionnelId, note, texte })
    const stats = await Avis.findOne({
      where: { professionnelId },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('note')), 'moyenne'],
        [sequelize.fn('COUNT', sequelize.col('id')),  'total'],
      ],
      raw: true,
    })
    await pro.update({ note_moyenne: parseFloat(stats.moyenne).toFixed(2), nombre_avis: parseInt(stats.total) })
    res.status(201).json({ message: 'Avis publié.', avis })
  } catch (error) { next(error) }
}

module.exports = { getAvis, createAvis }