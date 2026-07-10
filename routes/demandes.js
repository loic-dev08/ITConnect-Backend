const express                    = require('express')
const router                     = express.Router()
const { authentifier, autoriser } = require('../middlewares/auth')
const { getDemandes, createDemande, getDemandeById, updateStatut } = require('../controllers/demandeController')

router.use(authentifier)
router.get('/',           getDemandes)
router.post('/',          autoriser('particulier', 'entreprise'), createDemande)
router.get('/:id',        getDemandeById)
router.put('/:id/statut', autoriser('professionnel'), updateStatut)

module.exports = router