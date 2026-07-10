require('dotenv').config()
const express        = require('express')
const cors           = require('cors')
const { connectDB, sequelize } = require('./config/database')
const gestionErreurs = require('./middlewares/erreurs')

require('./models')

const authRoutes           = require('./routes/auth')
const professionnelsRoutes = require('./routes/professionnels')
const demandesRoutes       = require('./routes/demandes')

const app  = express()
const PORT = process.env.PORT || 3000

app.use(cors({
  origin:      process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ── Encodage UTF-8 pour les caractères accentués et emojis ──
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  next()
})

app.use('/api/auth',           authRoutes)
app.use('/api/professionnels', professionnelsRoutes)
app.use('/api/demandes',       demandesRoutes)

app.get('/', (req, res) => {
  res.json({ message: '🚀 API ITConnect opérationnelle', version: '1.0.0' })
})

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} introuvable.` })
})

app.use(gestionErreurs)

async function demarrer() {
  await connectDB()
  await sequelize.sync({ force: false })
  console.log('✅ Tables synchronisées avec MySQL.')
  app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur http://localhost:${PORT}`)
  })
}

demarrer()