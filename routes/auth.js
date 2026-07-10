const express          = require('express')
const router           = express.Router()
const { authentifier } = require('../middlewares/auth')
const { inscription, connexion, getMe, updateMe, updateMotDePasse, deleteMe } = require('../controllers/authController')

router.post('/inscription',   inscription)
router.post('/connexion',     connexion)
router.get('/me',             authentifier, getMe)
router.put('/me',             authentifier, updateMe)
router.put('/mot-de-passe',   authentifier, updateMotDePasse)
router.delete('/me',          authentifier, deleteMe)

module.exports = router