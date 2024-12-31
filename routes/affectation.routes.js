const express = require("express");
const router = express.Router();
const affectationController = require('./../controllers/affectation.controller')


router.get('/', affectationController.getAffectation)
router.post('/', affectationController.postAffectation);

module.exports = router;