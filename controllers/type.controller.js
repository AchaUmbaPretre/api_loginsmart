const { db } = require("./../config/database");
const { validationResult } = require('express-validator');


const queryAsync = (query, values = []) =>
    new Promise((resolve, reject) => {
        db.query(query, values, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });

exports.getCatPermis = async (req, res) => {
    try {
        const query = `SELECT * FROM cat_permis`;
    
        const chauffeurs = await queryAsync(query);
        
        return res.status(200).json({
            message: 'Liste des cat permis récupérée avec succès',
            data: chauffeurs,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des cat permis :', error);
        
        return res.status(500).json({
                    error: "Une erreur s'est produite lors de la récupération des chauffeurs.",
        });
    }
}

exports.getTypeContrat = async (req, res) => {
    try {
        const query = `SELECT * FROM type_contrat`;
    
        const cat = await queryAsync(query);
        
        return res.status(200).json({
            message: 'Liste des type de contrats récupérés avec succès',
            data: cat,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des cat permis :', error);
        
        return res.status(500).json({
                    error: "Une erreur s'est produite lors de la récupération des chauffeurs.",
        });
    }
}

exports.getEtatCivil = async (req, res) => {
    try {
        const query = `SELECT * FROM etat_civils`;
    
        const etatCivil = await queryAsync(query);
        
        return res.status(200).json({
            message: 'Liste des type de contrats récupérés avec succès',
            data: etatCivil,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des cat permis :', error);
        
        return res.status(500).json({
                    error: "Une erreur s'est produite lors de la récupération des chauffeurs.",
        });
    }
}