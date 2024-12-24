const express = require("express");
const router = express.Router();
const  maintenantController = require('./../controllers/maintenance.controller');

router.get('/reparation', maintenantController.getReparation)
router.post('/reparation', maintenantController.postReparation)

module.exports = router;