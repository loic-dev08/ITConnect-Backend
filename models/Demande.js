const { DataTypes } = require('sequelize')
const { sequelize }  = require('../config/database')

const Demande = sequelize.define('Demande', {
  id:              { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  clientId:        { type: DataTypes.INTEGER, allowNull: false, field: 'client_id' },
  professionnelId: { type: DataTypes.INTEGER, allowNull: false, field: 'professionnel_id' },
  objet:           { type: DataTypes.STRING(255), allowNull: false },
  message:         { type: DataTypes.TEXT, allowNull: false },
  statut:          { type: DataTypes.ENUM('En attente','En cours','Terminée','Refusée'),
                     allowNull: false, defaultValue: 'En attente' },
}, {
  tableName: 'demandes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})

module.exports = Demande