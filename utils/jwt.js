const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '15m' });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, REFRESH_SECRET_KEY, { expiresIn: '7d' });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};

const verifyRefreshToken = (token) => {
  return jwt.verify(token, REFRESH_SECRET_KEY);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
