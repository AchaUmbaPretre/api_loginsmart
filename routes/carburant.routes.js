const express = require("express");
const router = express.Router();
const carburantController = require('./../controllers/carburant.controller');


router.get('/count', carburantController.getCarburantCount);
router.get('/', carburantController.getCarburant);
router.get('/consommation', carburantController.getCarburantConsomm);
router.get('/consommationOne', carburantController.getCarburantConsomOne);
router.get('/one', carburantController.getCarburantOne);
router.get('/cinq_derniers', carburantController.getCarburantCinq)
router.post('/', carburantController.postCarburant);

router.get('/rapport_detail_vehicule', carburantController.getCarburantRapportDetailVehicule)
router.get('/rapport_detail_site_SIEGE_KIN', carburantController.getCarburantRapportDetailSites)
router.get('/rapport_detail_site_all', carburantController.getCarburantRapportDetailSitesALL)


module.exports = router;