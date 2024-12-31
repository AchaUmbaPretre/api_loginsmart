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

exports.getAffectation = async (req, res) => {
    try {
        const query = `SELECT * FROM affectations`;
    
        const etatCivil = await queryAsync(query);
        
        return res.status(200).json({
            message: 'Liste des affectations récupérés avec succès',
            data: etatCivil,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des affectations :', error);
        
        return res.status(500).json({
                    error: "Une erreur s'est produite lors de la récupération des affectations.",
        });
    }
}