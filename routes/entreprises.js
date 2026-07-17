const express = require('express')
const router  = express.Router()
const { getEntreprises } = require('../controllers/entrepriseController')
const express = require('express')
const router  = express.Router()
const { getEntreprises, getEntrepriseById } = require('../controllers/entrepriseController')

router.get('/', getEntreprises)
router.get('/:id', getEntrepriseById)

module.exports = router

router.get('/', getEntreprises)

module.exports = router