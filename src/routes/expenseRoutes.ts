import express from "express";
import authenticate from "../middleware/authenticate";
import ExpenseController from "../controllers/expenseController";

const router = express.Router();

router.get("/all/:id", authenticate, ExpenseController.getExpenses);
router.get("/expense/:id", authenticate, ExpenseController.getExpenseById);
router.post("/", authenticate, ExpenseController.addExpense);
router.put("/:id", authenticate, ExpenseController.updateExpense);
router.delete("/:id", authenticate, ExpenseController.deleteExpense);

export default router;
