"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMAIL_PASS = exports.EMAIL_USER = exports.MONGO_URI = exports.JWT_SECRET = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
exports.MONGO_URI = process.env.MONGO_URI;
exports.EMAIL_USER = process.env.EMAIL_USER;
exports.EMAIL_PASS = process.env.EMAIL_PASS;
