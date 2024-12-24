const express = require("express");
const router = express.Router();
const  typeController = require('./../controllers/type.controller');

router.get('/cat_permis', typeController.getCatPermis);
router.get('/type_contrat', typeController.getTypeContrat);
router.get('/etat_civil', typeController.getEtatCivil);
router.get('/type_fonction', typeController.getTypeFonction);
router.get('/type_marque', typeController.getTypeMarque);
router.get('/type_modele', typeController.getTypeModele);
router.get('/couleur', typeController.getCouleur);
router.get('/cat_vehicule', typeController.getCatVehicule);
router.get('/type_disposition', typeController.getTypeDisposition);
router.get('/type_carburant', typeController.getTypeCarburant);
router.get('/type_reparation', typeController.getTypeReparation);


module.exports = router;