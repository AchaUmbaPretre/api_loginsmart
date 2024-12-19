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

//Categorie de permis
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

//Type de contrat
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

//Etat civil
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

//Type de fonction
exports.getTypeFonction = async (req, res) => {
    try {
        const query = `SELECT * FROM type_fonction`;
    
        const typeFonction = await queryAsync(query);
        
        return res.status(200).json({
            message: 'Liste des types de fonction récupérés avec succès',
            data: typeFonction,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des cat permis :', error);
        
        return res.status(500).json({
            error: "Une erreur s'est produite lors de la récupération des chauffeurs.",
        });
    }
}

exports.getTypeMarque = async (req, res) => {
    try {
        const query = `SELECT * FROM marque`;
    
        const typeFonction = await queryAsync(query);
        
        return res.status(200).json({
            message: 'Liste des marques récupérées avec succès',
            data: typeFonction,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des marques:', error);
        
        return res.status(500).json({
            error: "Une erreur s'est produite lors de la récupération des marques.",
        });
    }
}

exports.getTypeModele = async (req, res) => {
    const {id_marque} = req.query;

    try {
        if(!id_marque) {
            return res.status(400).json({error: 'id_marque est requis'})
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const query = `SELECT * FROM modeles WHERE id_marque = ?`;
    
        const typeFonction = await queryAsync(query,id_marque);
        
        return res.status(200).json({
            message: 'Liste des modeles récupérées avec succès',
            data: typeFonction,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des modeles:', error);
        
        return res.status(500).json({
            error: "Une erreur s'est produite lors de la récupération des modèles.",
        });
    }
}

//Couleur
exports.getCouleur = async (req, res) => {

    try {
        const query = `SELECT * FROM couleurs`;
    
        const typeFonction = await queryAsync(query);
        
        return res.status(200).json({
            message: 'Liste des couleurs récupérées avec succès',
            data: typeFonction,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des couleurs:', error);
        
        return res.status(500).json({
            error: "Une erreur s'est produite lors de la récupération des couleurs.",
        });
    }
}

//Categorie vehicule
exports.getCatVehicule = async (req, res) => {

    try {
        const query = `SELECT * FROM categorie_vehicules`;
    
        const typeFonction = await queryAsync(query);
        
        return res.status(200).json({
            message: 'Liste des categories de vehicule récupérées avec succès',
            data: typeFonction,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des couleurs:', error);
        
        return res.status(500).json({
            error: "Une erreur s'est produite lors de la récupération des couleurs.",
        });
    }
}