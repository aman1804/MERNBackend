const jwt = require("jsonwebtoken")

const generateToken = async(id,expiresIn) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: expiresIn || "30d",
  });
};

module.exports = generateToken;