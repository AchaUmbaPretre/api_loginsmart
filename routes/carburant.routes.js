const express = require("express");
const router = express.Router();
const carburantController = require('./../controllers/carburant.controller');


router.get('/count', carburantController.getCarburantCount)
router.get('/', carburantController.getCarburant)
router.post('/', carburantController.postCarburant);

module.exports = router;