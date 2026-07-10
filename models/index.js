const User          = require('./User')
const Professionnel = require('./Professionnel')
const Demande       = require('./Demande')
const Avis          = require('./Avis')

User.hasOne(Professionnel,  { foreignKey: 'user_id', as: 'profilPro' })
Professionnel.belongsTo(User, { foreignKey: 'user_id', as: 'user' })

User.hasMany(Demande, { foreignKey: 'client_id', as: 'demandesEnvoyees' })
Demande.belongsTo(User, { foreignKey: 'client_id', as: 'client' })

Professionnel.hasMany(Demande, { foreignKey: 'professionnel_id', as: 'demandesRecues' })
Demande.belongsTo(Professionnel, { foreignKey: 'professionnel_id', as: 'professionnel' })

User.hasMany(Avis, { foreignKey: 'client_id', as: 'avisLaisses' })
Avis.belongsTo(User, { foreignKey: 'client_id', as: 'client' })

Professionnel.hasMany(Avis, { foreignKey: 'professionnel_id', as: 'avis' })
Avis.belongsTo(Professionnel, { foreignKey: 'professionnel_id', as: 'professionnel' })

module.exports = { User, Professionnel, Demande, Avis }