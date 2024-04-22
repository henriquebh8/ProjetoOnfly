"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config/config");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const expenseRoutes_1 = __importDefault(require("./routes/expenseRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
mongoose_1.default
    .connect(config_1.MONGO_URI)
    .then(() => console.log("MongoDB connection ready."))
    .catch(err => console.error("Error connecting to MongoDB:", err));
app.use("/login", authRoutes_1.default);
app.use("/expenses", expenseRoutes_1.default);
app.use("/", userRoutes_1.default);
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).send("Something broke!");
});
exports.default = app;
