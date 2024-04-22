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
const userService_1 = __importDefault(require("../services/userService"));
class UserController {
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield userService_1.default.createUser(email, password);
                res.status(201).send(user);
            }
            catch (error) {
                res.status(500).send("Error registering new user: " + error.message);
            }
        });
    }
    findUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id } = req.body;
                const user = yield userService_1.default.findUserById(_id);
                if (!user) {
                    return res.status(404).send("User not found.");
                }
                res.status(200).send(user);
            }
            catch (error) {
                res.status(500).send("Error finding user: " + error.message);
            }
            return undefined;
        });
    }
}
exports.default = new UserController();
