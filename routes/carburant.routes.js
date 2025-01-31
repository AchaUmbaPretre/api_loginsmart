const express = require("express");
const router = express.Router();
const carburantController = require('./../controllers/carburant.controller');


router.get('/count', carburantController.getCarburantCount);
router.get('/', carburantController.getCarburant);
router.get('/consommation', carburantController.getCarburantConsomm);
router.get('/consommationOne', carburantController.getCarburantConsomOne);
router.get('/one', carburantController.getCarburantOne);
router.get('/one_v', carburantController.getCarburantOneV);
router.get('/cinq_derniers', carburantController.getCarburantCinq);
router.post('/', carburantController.postCarburant);
router.put('/', carburantController.putCarburant);
router.put('/delete_carburant', carburantController.deleteCarburant)

router.get('/rapport_detail_vehicule', carburantController.getCarburantRapportDetailVehicule);
router.get('/rapport_detail_site_SIEGE_KIN', carburantController.getCarburantRapportDetailSites);
router.get('/rapport_detail_site_all', carburantController.getCarburantRapportDetailSitesALL);
router.get('/rapport_detail_info_gen', carburantController.getCarburantRapportInfoGen);

//RAPPORT TYPE CARBURANT SIEGE KIN
router.get('/rapport_carburant_siege_kin', carburantController.getCarburantTypeSiegeKin);
router.get('/rapport_carburant_siege_Autres', carburantController.getCarburantTypeAutres);

//Consommation mensuelle de mes vehicules
router.get('/consommation_mensuelle', carburantController.getConsommationTypeCarburant);
router.get('/reparation_carburant', carburantController.getReparationTypeCarburant);

module.exports = router;