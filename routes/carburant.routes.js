const express = require("express");
const router = express.Router();
const carburantController = require('./../controllers/carburant.controller');


router.get('/count', carburantController.getCarburantCount);
router.get('/', carburantController.getCarburant);
router.get('/consommation', carburantController.getCarburantConsomm);
router.get('/one', carburantController.getCarburantOne);
router.get('/cinq_derniers', carburantController.getCarburantCinq)
router.post('/', carburantController.postCarburant);

module.exports = router;