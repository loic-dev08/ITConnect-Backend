const { DataTypes } = require('sequelize')
const { sequelize }  = require('../config/database')

const Avis = sequelize.define('Avis', {
  id:              { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  clientId:        { type: DataTypes.INTEGER, allowNull: false, field: 'client_id' },
  professionnelId: { type: DataTypes.INTEGER, allowNull: false, field: 'professionnel_id' },
  note:            { type: DataTypes.INTEGER, allowNull: false,
                     validate: { min: 1, max: 5 } },
  texte:           { type: DataTypes.TEXT, allowNull: false },
}, {
  tableName: 'avis',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [{ unique: true, fields: ['client_id', 'professionnel_id'] }],
})

module.exports = Avis