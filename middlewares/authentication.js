const { UnauthenticatedError } = require("../error");
const { isTokenValid } = require("../utils/jwt");
const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Tidak ada token");
  }

  const accessToken = authHeader.split(" ")[1];
  try {
    if (accessToken) {
      const payload = isTokenValid(accessToken);
      req.user = payload;
      return next();
    }
    next();
  } catch (error) {
    throw new UnauthenticatedError("autentikasi tidak valid");
  }
};

module.exports = {
  authenticateUser,
};
