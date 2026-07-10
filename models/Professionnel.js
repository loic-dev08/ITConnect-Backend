const { DataTypes } = require('sequelize')
const { sequelize }  = require('../config/database')

const Professionnel = sequelize.define('Professionnel', {
  id:              { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId:          { type: DataTypes.INTEGER, allowNull: false, unique: true, field: 'user_id' },
  specialite:      { type: DataTypes.STRING(150), allowNull: false },
  bio:             { type: DataTypes.TEXT, allowNull: true },
  ville:           { type: DataTypes.STRING(100), allowNull: false },
  tarif:           { type: DataTypes.STRING(50), allowNull: true },
  experience:      { type: DataTypes.STRING(50), allowNull: true },
  competences:     { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
  disponible:      { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  note_moyenne:    { type: DataTypes.DECIMAL(3,2), allowNull: true },
  nombre_avis:     { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  nombre_missions: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
}, {
  tableName: 'professionnels',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})

module.exports = Professionnel