"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const config_1 = require("../config/config");
class UserService {
    createUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            const user = new user_1.default({
                email,
                password: hashedPassword,
            });
            return user.save();
        });
    }
    validatePassword(user, inputPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcryptjs_1.default.compare(inputPassword, user.password);
        });
    }
    generateToken(user) {
        return jsonwebtoken_1.default.sign({ _id: user._id }, config_1.JWT_SECRET, { expiresIn: "6h" });
    }
    findUserById(userId) {
        return user_1.default.findById(userId);
    }
}
exports.default = new UserService();
