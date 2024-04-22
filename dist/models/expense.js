"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const expenseSchema = new mongoose_1.default.Schema({
    description: { type: String, required: true, maxlength: 191 },
    date: { type: Date, required: true },
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    value: { type: Number, required: true, min: 0 },
});
exports.default = mongoose_1.default.model("Expense", expenseSchema);
