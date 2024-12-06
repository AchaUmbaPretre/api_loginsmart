const jwtUtils = require('../utils/jwt');

exports.authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: 'Token manquant' });

  const token = authHeader.split(' ')[1];
  try {
    const user = jwtUtils.verifyAccessToken(token);
    req.user = user; // Ajoute les infos utilisateur à la requête
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token invalide ou expiré' });
  }
};
