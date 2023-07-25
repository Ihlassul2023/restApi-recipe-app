const jwt = require("jsonwebtoken");
const createAccessToken = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1w" });
  return token;
};
const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET);
module.exports = {
  createAccessToken,
  isTokenValid,
};
