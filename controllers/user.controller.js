const { db } = require("./../config/database");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { validationResult } = require('express-validator');


dotenv.config();

exports.getUsers = (req, res) => {
    const q = `SELECT * FROM users`

    db.query(q, (error, data) => {
        if (error) {
            return res.status(500).send(error);
        }
        return res.status(200).json(data);
    });
}

exports.getUserOne = (req, res) => {
    const { id } = req.query;

    const q = `
        SELECT 
            nom,
            prenom,
            email,
            mot_de_passe,
        FROM users 
            WHERE id  = ?
    `;
     
    db.query(q, [id], (error, data) => {
        if (error) {
            return res.status(500).send(error);
        }
        return res.status(200).json(data);
    });
}

exports.registerUser = async (req, res) => {
    const { nom, prenom, email, mot_de_passe  } = req.body;
  
    try {
      const query = 'SELECT * FROM users WHERE email = ?';
      const values = [email];
  
      db.query(query, values, async (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
  
        if (results.length > 0) {
          return res.status(200).json({ message: 'Utilisateur existe déjà', success: false });
        }
  
        const defaultPassword = mot_de_passe || '1234';
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);
  
        const insertQuery = 'INSERT INTO users (nom, prenom, email, mot_de_passe ) VALUES (?, ?, ?, ?)';
        const insertValues = [nom, prenom, email, hashedPassword];
  
        db.query(insertQuery, insertValues, (err, insertResult) => {
          if (err) {
            console.log(err)
            return res.status(500).json({ error: err.message });
          }
          res.status(201).json({ message: 'Enregistré avec succès', success: true });
        });
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: `Erreur dans le contrôleur de registre : ${err.message}`,
      });
    }
  };

exports.putUserOne = async (req, res) => {
    const { id } = req.query;
  
    const q = "UPDATE users SET `nom` = ?, `email` = ?, `mot_de_passe` = ? WHERE id = ?";

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash( req.body.mot_de_passe, salt);
    const values = [
      req.body.nom,
      req.body.email,
      hashedPassword,
      id
    ];
  
    db.query(q, values, (err, data) => {
      if (err) {
        console.error(err);
        console.log(err)
        return res.status(500).json(err);
      }
      return res.json(data);
    });
  };


  //Chauffeur  
  // Convertir la méthode query en promesse pour le module mysql
  const queryAsync = (query, values) =>
      new Promise((resolve, reject) => {
          db.query(query, values, (error, results) => {
              if (error) {
                  return reject(error);
              }
              resolve(results);
          });
      });
  
exports.postChauffeur = async (req, res) => {
      try {
          // Validation des données entrantes
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
              return res.status(400).json({ errors: errors.array() });
          }
  
          const {
              nom,
              prenom,
              telephone,
              adresse,
              id_etat_civil,
              statut,
              profil,
              sexe,
              id_type_contrat,
              type_trav,
              id_permi,
              id_ville,
              date_naissance,
              user_cr,
              tel_service,
          } = req.body;
  
          const query = `
              INSERT INTO chauffeurs (
                  nom, prenom, telephone, adresse, id_etat_civil,
                  statut, profil, sexe, id_type_contrat, type_trav,
                  id_permi, id_ville, date_naissance, user_cr, tel_service
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
  
          const values = [
              nom, prenom, telephone, adresse, id_etat_civil,
              statut, profil, sexe, id_type_contrat, type_trav,
              id_permi, id_ville, date_naissance, user_cr, tel_service,
          ];
  
          // Exécution de la requête
          const result = await queryAsync(query, values);
  
          return res.status(201).json({
              message: 'Chauffeur ajouté avec succès',
              data: { id: result.insertId, nom, prenom },
          });
      } catch (error) {
          console.error('Erreur lors de l’ajout du chauffeur :', error);
  
          const statusCode = error.code === 'ER_DUP_ENTRY' ? 409 : 500;
          const errorMessage =
              error.code === 'ER_DUP_ENTRY'
                  ? "Un chauffeur avec ces informations existe déjà."
                  : "Une erreur s'est produite lors de l'ajout du chauffeur.";
  
          return res.status(statusCode).json({ error: errorMessage });
      }
  };
  