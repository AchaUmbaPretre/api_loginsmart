const express = require("express");
const router = express.Router();
const  typeController = require('./../controllers/type.controller');

router.get('/cat_permis', typeController.getCatPermis);
router.get('/type_contrat', typeController.getTypeContrat);
router.get('/etat_civil', typeController.getEtatCivil);
router.get('/type_fonction', typeController.getTypeFonction);


module.exports = router;