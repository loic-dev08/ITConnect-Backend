const jwt       = require('jsonwebtoken')
const { User }  = require('../models')

async function authentifier(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token manquant.' })
    }
    const token   = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user    = await User.findByPk(decoded.id)
    if (!user) return res.status(401).json({ message: 'Utilisateur introuvable.' })
    req.user = user
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError')
      return res.status(401).json({ message: 'Session expirée.' })
    return res.status(401).json({ message: 'Token invalide.' })
  }
}

function autoriser(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return res.status(403).json({ message: 'Accès interdit.' })
    next()
  }
}

module.exports = { authentifier, autoriser }