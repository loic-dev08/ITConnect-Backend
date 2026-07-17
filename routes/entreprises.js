const express = require('express')
const router  = express.Router()
const { getEntreprises } = require('../controllers/entrepriseController')

router.get('/', getEntreprises)

module.exports = router