const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('./../config/database');
const dotenv = require('dotenv');
const jwtUtils = require('../utils/jwt');

dotenv.config();

exports.register = async (req, res) => {
  const { nom, prenom, email, mot_de_passe } = req.body;

  try {
    // Vérifier si l'email existe déjà
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur serveur.' });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: 'Email déjà utilisé.' });
      }

      try {
        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

        // Insérer l'utilisateur dans la base de données
        db.query(
          'INSERT INTO users (nom, prenom, email, mot_de_passe) VALUES (?, ?, ?, ?)',
          [nom, prenom, email, hashedPassword],
          (err, result) => {
            if (err) {
              console.log(err); // Log l'erreur pour le débogage
              return res.status(500).json({ error: 'Erreur serveur lors de l\'insertion.' });
            }
            // Si tout se passe bien, répondre avec succès
            res.status(201).json({ message: 'Utilisateur enregistré avec succès.' });
          }
        );
      } catch (err) {
        console.log(err); // Log l'erreur pour le débogage
        return res.status(500).json({ error: 'Erreur lors du hachage du mot de passe.' });
      }
    });
  } catch (err) {
    console.log(err); // Log l'erreur pour le débogage
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

exports.login = (req, res) => {
  const { email, mot_de_passe } = req.body;

  // Étape 1 : Récupérer l'utilisateur par email
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Erreur lors de la requête SELECT :', err);
      return res.status(500).json({ error: 'Erreur serveur.' });
    }

    if (results.length === 0) {
      // Si aucun utilisateur n'est trouvé
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }

    const user = results[0];

    try {
      const isPasswordValid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
      }

      // Étape 3 : Générer les tokens JWT
      const accessToken = jwtUtils.generateAccessToken(user);
      const refreshToken = jwtUtils.generateRefreshToken(user);

      // Étape 4 : Enregistrer le refresh token dans la base de données
      const saveRefreshToken = 'UPDATE users SET refresh_token = ? WHERE id = ?';
      db.query(saveRefreshToken, [refreshToken, user.id], (err) => {
        if (err) {
          console.error('Erreur lors de la mise à jour du refresh token :', err);
          return res.status(500).json({ error: 'Erreur serveur.' });
        }

        // Étape 5 : Répondre avec les tokens
        return res.json({
          accessToken,
          refreshToken,
          user: {
            id: user.id,
            email: user.email,
            nom: user.nom,
            prenom: user.prenom
          }
        });
        ;
      });
    } catch (err) {
      console.error('Erreur lors de la comparaison des mots de passe :', err);
      return res.status(500).json({ error: 'Erreur serveur.' });
    }
  });
};

exports.refreshToken = (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) return res.status(401).json({ error: 'Refresh token manquant' });

  const query = 'SELECT * FROM users WHERE refresh_token = ?';
  db.query(query, [refresh_token], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });

    if (results.length === 0) {
      return res.status(403).json({ error: 'Refresh token invalide' });
    }

    const user = results[0];

    try {
      jwtUtils.verifyRefreshToken(refresh_token);

      // Générer un nouveau access token
      const newAccessToken = jwtUtils.generateAccessToken(user);
      return res.json({ access_token: newAccessToken });
    } catch (error) {
      return res.status(403).json({ error: 'Refresh token expiré ou invalide' });
    }
  });
};

exports.logout = (req, res) => {
  const { refresh_token } = req.body;

  const query = 'UPDATE users SET refresh_token = NULL WHERE refresh_token = ?';
  db.query(query, [refresh_token], (err) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    return res.status(200).json({ message: 'Déconnecté avec succès' });
  });
};

