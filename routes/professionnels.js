const express                    = require('express')
const router                     = express.Router()
const { authentifier, autoriser } = require('../middlewares/auth')
const { getProfessionnels, getProfessionnelById, updateProfilPro } = require('../controllers/proController')
const { getAvis, createAvis }    = require('../controllers/avisController')

router.get('/',    getProfessionnels)
router.get('/:id', getProfessionnelById)
router.put('/me',  authentifier, autoriser('professionnel'), updateProfilPro)
router.get('/:id/avis',  getAvis)
router.post('/:id/avis', authentifier, autoriser('particulier', 'entreprise'), createAvis)

module.exports = router