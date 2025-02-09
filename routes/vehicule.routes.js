const express = require("express");
const router = express.Router();
const  vehiculeController = require('./../controllers/vehicule.controller');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = uuidv4() + ext;
        cb(null, filename);
    }
});

const upload = multer({ storage });

router.get('/count', vehiculeController.getVehiculeCount);
router.get('/', vehiculeController.getVehicule);
router.get('/one', vehiculeController.getVehiculeOne);
router.post('/', upload.array('img', 10),vehiculeController.postVehicule);
router.put('/', upload.array('img', 10),vehiculeController.putVehicule);
router.put('/delete_vehicule', vehiculeController.deleteVehicule);

module.exports = router;