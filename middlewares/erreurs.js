function gestionErreurs(err, req, res, next) {
  console.error('❌ Erreur :', err.message)
  if (err.name === 'SequelizeValidationError')
    return res.status(400).json({ message: err.errors[0].message })
  if (err.name === 'SequelizeUniqueConstraintError')
    return res.status(409).json({ message: 'Cette valeur est déjà utilisée.' })
  if (err.name === 'JsonWebTokenError')
    return res.status(401).json({ message: 'Token invalide.' })
  if (err.statusCode)
    return res.status(err.statusCode).json({ message: err.message })
  res.status(500).json({ message: 'Erreur interne du serveur.' })
}

module.exports = gestionErreurs