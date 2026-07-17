const { User } = require('../models')
const { Op }    = require('sequelize')

async function getEntreprises(req, res, next) {
  try {
    const { ville } = req.query
    const where = { role: 'entreprise' }
    if (ville) where.ville = { [Op.like]: `%${ville}%` }

    const entreprises = await User.findAll({
      where,
      attributes: ['id', 'prenom', 'nom', 'email', 'ville', 'created_at'],
      order: [['prenom', 'ASC']],
    })
    res.json({ entreprises })
  } catch (error) { next(error) }
}

module.exports = { getEntreprises }