import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = (req, res, next) => {
  const authHeader =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.decoded = decoded;
    next(); // Continue to the next middleware or route handler
  });
};
