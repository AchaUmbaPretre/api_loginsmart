const express = require("express");
const router = express.Router();
const  chauffeurController = require('./../controllers/chauffeur.controller');
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

router.get('/count', chauffeurController.getChauffeurCount)
router.get('/', chauffeurController.getChauffeur)
router.post('/', upload.array('profil', 10),chauffeurController.postChauffeur);

module.exports = router;