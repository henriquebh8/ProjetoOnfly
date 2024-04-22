import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user";
import { JWT_SECRET } from "../config/config";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;
    if (!token)
      return res
        .status(401)
        .send("not authorized. you need to be authenticated.");

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (typeof decoded === "object" && decoded._id) {
      User.findById(decoded._id)
        .then(user => {
          if (!user) {
            return res.status(404).send("User not found.");
          }
          req.user = user;
          next();
        })
        .catch(err => {
          res.status(500).send("Failed to authenticate token.");
        });
    } else {
      return res.status(400).send("Invalid token.");
    }
  } catch (error) {
    res.status(400).send("Invalid token.");
  }
};

export default authenticate;
