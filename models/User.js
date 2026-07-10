const { DataTypes } = require('sequelize')
const { sequelize }  = require('../config/database')
const bcrypt         = require('bcryptjs')

const User = sequelize.define('User', {
  id:         { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  prenom:     { type: DataTypes.STRING(100), allowNull: false },
  nom:        { type: DataTypes.STRING(100), allowNull: false },
  email:      { type: DataTypes.STRING(255), allowNull: false, unique: true,
                validate: { isEmail: { msg: 'Email invalide.' } } },
  motDePasse: { type: DataTypes.STRING(255), allowNull: false, field: 'mot_de_passe' },
  role:       { type: DataTypes.ENUM('particulier','entreprise','professionnel','admin'),
                allowNull: false, defaultValue: 'particulier' },
  ville:      { type: DataTypes.STRING(100), allowNull: true, defaultValue: null },
}, {
  tableName: 'utilisateurs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})

User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10)
  user.motDePasse = await bcrypt.hash(user.motDePasse, salt)
})

User.beforeUpdate(async (user) => {
  if (user.changed('motDePasse')) {
    const salt = await bcrypt.genSalt(10)
    user.motDePasse = await bcrypt.hash(user.motDePasse, salt)
  }
})

User.prototype.verifierMotDePasse = async function(mdp) {
  return bcrypt.compare(mdp, this.motDePasse)
}

User.prototype.toJSON = function() {
  const values = { ...this.get() }
  delete values.motDePasse
  return values
}

module.exports = User