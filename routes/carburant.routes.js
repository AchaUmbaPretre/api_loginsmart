const express = require("express");
const router = express.Router();
const carburantController = require('./../controllers/carburant.controller');


router.get('/count', carburantController.getCarburantCount)
router.get('/', carburantController.getCarburant)
router.post('/', upload.array('img', 10), carburantController.postCarburant);

module.exports = router;