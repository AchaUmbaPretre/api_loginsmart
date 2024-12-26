const express = require("express");
const router = express.Router();
const  maintenantController = require('./../controllers/maintenance.controller');

router.get('/reparation', maintenantController.getReparation)
router.post('/reparation', maintenantController.postReparation)

router.get('/suivi', maintenantController.getSuivi)
router.post('/suivi', maintenantController.postSuivi)

module.exports = router;