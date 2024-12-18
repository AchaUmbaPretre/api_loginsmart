const express = require("express");
const router = express.Router();
const  typeController = require('./../controllers/type.controller');

router.get('/cat_permis', typeController.getCatPermis)
router.get('/type_contrat', typeController.getTypeContrat);

module.exports = router;