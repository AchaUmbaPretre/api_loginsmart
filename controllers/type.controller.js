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

//Type disposition
exports.getTypeDisposition = async (req, res) => {

    try {
        const query = `SELECT * FROM disposition_cylindre`;
    
        const typeFonction = await queryAsync(query);
        
        return res.status(200).json({
            message: 'Liste de disposition des vehicules récupérées avec succès',
            data: typeFonction,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des dispositions:', error);
        return res.status(500).json({
            error: "Une erreur s'est produite lors de la récupération des dispositions.",
        });
    }
}

//Type carburant
exports.getTypeCarburant = async (req, res) => {

    try {
        const query = `SELECT * FROM type_carburant`;
    
        const typeFonction = await queryAsync(query);
        
        return res.status(200).json({
            message: 'Liste de type des carburant récupérées avec succès',
            data: typeFonction,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des dispositions:', error);
        return res.status(500).json({
            error: "Une erreur s'est produite lors de la récupération des dispositions.",
        });
    }
}

//Type réparation
exports.getTypeReparation = async (req, res) => {

    try {
        const query = `SELECT * FROM type_reparations`;
    
        const typeFonction = await queryAsync(query);
        
        return res.status(200).json({
            message: 'Liste de type des réparations récupérées avec succès',
            data: typeFonction,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des dispositions:', error);
        return res.status(500).json({
            error: "Une erreur s'est produite lors de la récupération des dispositions.",
        });
    }
}

//Fournisseur
exports.getFournisseur = async (req, res) => {

    try {
        const query = `SELECT * FROM fournisseurs`;
    
        const typeFonction = await queryAsync(query);
        
        return res.status(200).json({
            message: 'Liste de type des fournisseurs récupérées avec succès',
            data: typeFonction,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des dispositions:', error);
        return res.status(500).json({
            error: "Une erreur s'est produite lors de la récupération des dispositions.",
        });
    }
}

//Type tache
exports.getTache = async (req, res) => {

    try {
        const query = `SELECT * FROM type_tache`;
    
        const typeTache = await queryAsync(query);
        
        return res.status(200).json({
            message: 'Liste de type des taches récupérées avec succès',
            data: typeTache,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des dispositions:', error);
        return res.status(500).json({
            error: "Une erreur s'est produite lors de la récupération des dispositions.",
        });
    }
}

//Categorie piece
exports.getCatPieces = async (req, res) => {

    try {
        const query = `SELECT * FROM categorie_pieces`;
    
        const typeCatPiece = await queryAsync(query);
        
        return res.status(200).json({
            message: 'Liste de type des cat pieces récupérées avec succès',
            data: typeCatPiece,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des dispositions:', error);
        return res.status(500).json({
            error: "Une erreur s'est produite lors de la récupération des dispositions.",
        });
    }
}

//Type d' etat maintenance
exports.getEtatMaintenant = async (req, res) => {

    try {
        const query = `SELECT * FROM etat_maintenance`;
    
        const etatMaintenance = await queryAsync(query);
        
        return res.status(200).json({
            message: 'Liste d état des maintenances récupérés avec succès',
            data: etatMaintenance,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des dispositions:', error);
        return res.status(500).json({
            error: "Une erreur s'est produite lors de la récupération des dispositions.",
        });
    }
}

//Site
exports.getSites = async (req, res) => {

    try {
        const query = `SELECT s.id_site, s.nom_site, s.adress, s.tel, s.state, v.ville, p.province FROM sites s
                            INNER JOIN villes v ON s.IdVille = v.id
                            INNER JOIN provinces p ON v.ref_prov = p.id`;
    
        const typeTache = await queryAsync(query);
        
        return res.status(200).json({
            message: 'Liste des sites récupérées avec succès',
            data: typeTache,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des sites:', error);
        return res.status(500).json({
            error: "Une erreur s'est produite lors de la récupération des sites",
        });
    }
}

//Ville
exports.getVille = async (req, res) => {

    try {
        const query = `SELECT * FROM villes`;
    
        const ville = await queryAsync(query);
        
        return res.status(200).json({
            message: 'Liste des villes récupérées avec succès',
            data: ville,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des villes:', error);
        return res.status(500).json({
            error: "Une erreur s'est produite lors de la récupération des villes",
        });
    }
}

//Zone
exports.getZones = async (req, res) => {

    try {
        const query = `SELECT * FROM zones`;
    
        const zones = await queryAsync(query);
        
        return res.status(200).json({
            message: 'Liste des zones récupérées avec succès',
            data: zones,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des zones:', error);
        return res.status(500).json({
            error: "Une erreur s'est produite lors de la récupération des zones",
        });
    }
}

//Province
exports.getProvince = async (req, res) => {

    try {
        const query = `SELECT * FROM provinces`;
    
        const provinces = await queryAsync(query);
        
        return res.status(200).json({
            message: 'Liste des provinces récupérées avec succès',
            data: provinces,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des provinces:', error);
        return res.status(500).json({
            error: "Une erreur s'est produite lors de la récupération des provinces",
        });
    }
}