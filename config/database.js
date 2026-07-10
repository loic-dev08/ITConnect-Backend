const { Sequelize } = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host:    process.env.DB_HOST || 'localhost',
    port:    process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    define: {
      charset:    'utf8mb4',
      collate:    'utf8mb4_unicode_ci',
      timestamps: true,
    },
  }
)

async function connectDB() {
  try {
    await sequelize.authenticate()
    console.log('✅ Connexion MySQL établie avec succès.')
  } catch (error) {
    console.error('❌ Impossible de se connecter à MySQL :', error.message)
    process.exit(1)
  }
}

module.exports = { sequelize, connectDB }