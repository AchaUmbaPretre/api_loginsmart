const express = require("express");
const router = express.Router();
const  chauffeurController = require('./../controllers/chauffeur.controller');

router.get('/count', chauffeurController.getChauffeurCount)
router.get('/', chauffeurController.getChauffeur)
router.post('/', chauffeurController.postChauffeur);

module.exports = router;