 
const User = require("../model/user.model");
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;
// Middleware to check if the user has the "admin" role
const authenticateAndAuthorize = (req, res, next) => {
  // Get the JWT token from the request header
  const authorizationHeader = req.header("Authorization");

  if (!authorizationHeader) {
    return res.status(401).json({ error: "Missing authorization token" });
  }

  token = req.header("Authorization").split(" ")[1];
 
  // Verify the JWT token
  jwt.verify(token, secretKey, (error, decodedToken) => {
    if (error) {
      return res.status(401).json({ error: "Invalid token" });
    }

     
    req.user = decodedToken;
 
    

     
    next();
  });
};

module.exports = authenticateAndAuthorize;
