const { User, Demande, Avis, Professionnel } = require('../models')
const { Op } = require('sequelize')

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

    // Ajoute le nombre de demandes et d'avis pour chaque entreprise
    const entreprisesAvecStats = await Promise.all(
      entreprises.map(async (e) => {
        const nombreDemandes = await Demande.count({ where: { clientId: e.id } })
        const nombreAvis = await Avis.count({ where: { clientId: e.id } })
        return {
          ...e.toJSON(),
          nombre_demandes: nombreDemandes,
          nombre_avis: nombreAvis,
        }
      })
    )

    res.json({ entreprises: entreprisesAvecStats })
  } catch (error) { next(error) }
}

async function getEntrepriseById(req, res, next) {
  try {
    const entreprise = await User.findOne({
      where: { id: req.params.id, role: 'entreprise' },
      attributes: ['id', 'prenom', 'nom', 'email', 'ville', 'created_at'],
    })
    if (!entreprise) return res.status(404).json({ message: 'Entreprise introuvable.' })

    const demandes = await Demande.findAll({
      where: { clientId: entreprise.id },
      include: [{
        model: Professionnel, as: 'professionnel',
        include: [{ model: User, as: 'user', attributes: ['prenom', 'nom'] }],
      }],
      order: [['created_at', 'DESC']],
    })

    const avis = await Avis.findAll({
      where: { clientId: entreprise.id },
      include: [{
        model: Professionnel, as: 'professionnel',
        include: [{ model: User, as: 'user', attributes: ['prenom', 'nom'] }],
      }],
      order: [['created_at', 'DESC']],
    })

    res.json({ entreprise, demandes, avis })
  } catch (error) { next(error) }
}

module.exports = { getEntreprises, getEntrepriseById }