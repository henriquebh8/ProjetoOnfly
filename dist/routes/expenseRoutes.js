"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
const expenseController_1 = __importDefault(require("../controllers/expenseController"));
const router = express_1.default.Router();
router.get("/all/:id", authenticate_1.default, expenseController_1.default.getExpenses);
router.get("/expense/:id", authenticate_1.default, expenseController_1.default.getExpenseById);
router.post("/", authenticate_1.default, expenseController_1.default.addExpense);
router.put("/:id", authenticate_1.default, expenseController_1.default.updateExpense);
router.delete("/:id", authenticate_1.default, expenseController_1.default.deleteExpense);
exports.default = router;
