const express = require("express");
const router = express.Router();
const  maintenantController = require('./../controllers/maintenance.controller');

router.get('/reparation', maintenantController.getReparation);
router.get('/reparation/one', maintenantController.getReparationOne)
router.post('/reparation', maintenantController.postReparation)

router.get('/suivi', maintenantController.getSuivi)
router.get('/suivi/one_reparation', maintenantController.getSuiviOneReparation)

router.post('/suivi', maintenantController.postSuivi)

//Controle technique
router.get('/controle', maintenantController.getControleTechnique);
router.post('/controle', maintenantController.postControlTechnique)

module.exports = router;