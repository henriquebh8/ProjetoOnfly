"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: [true, "Email address is required"],
        unique: true,
        lowercase: true,
        validate: [validator_1.default.isEmail, "Please provide a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
});
exports.default = mongoose_1.default.model("User", userSchema);
