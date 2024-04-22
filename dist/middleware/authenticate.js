"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const config_1 = require("../config/config");
const authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token)
            return res
                .status(401)
                .send("not authorized. you need to be authenticated.");
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        if (typeof decoded === "object" && decoded._id) {
            user_1.default.findById(decoded._id)
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
        }
        else {
            return res.status(400).send("Invalid token.");
        }
    }
    catch (error) {
        res.status(400).send("Invalid token.");
    }
};
exports.default = authenticate;
