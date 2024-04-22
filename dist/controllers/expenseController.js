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
Object.defineProperty(exports, "__esModule", { value: true });
const expenseService_1 = require("../services/expenseService");
class ExpenseController {
    getExpenses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // buscar sempre pelo id do usuario logado para não deixar um usuario ver as despesas de outro
            if (!req.user) {
                res.status(401).send("User not authenticated");
                return;
            }
            try {
                const sessionUserId = req.user.id;
                const expenses = yield expenseService_1.ExpenseService.findExpensesByUserId(sessionUserId);
                res.json(expenses);
            }
            catch (error) {
                res.status(500).send("Error retrieving expenses: " + error.message);
            }
        });
    }
    getExpenseById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user) {
                res.status(401).send("User not authenticated");
                return;
            }
            try {
                const expenseId = req.params.id;
                const userId = req.user._id;
                const expense = yield expenseService_1.ExpenseService.findExpenseById(expenseId, userId);
                if (!expense) {
                    res.status(404).send("Expense not found.");
                    return;
                }
                res.json(expense);
            }
            catch (error) {
                res.status(500).send("Error retrieving expense: " + error.message);
            }
        });
    }
    addExpense(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user) {
                res.status(401).send("User not authenticated");
                return;
            }
            try {
                const expenseData = {
                    description: req.body.description,
                    date: req.body.date,
                    user: req.user._id,
                    value: req.body.value,
                };
                const newExpense = yield expenseService_1.ExpenseService.createExpense(expenseData);
                res.status(201).json(newExpense);
            }
            catch (error) {
                res.status(500).send("Error adding expense: " + error.message);
            }
        });
    }
    updateExpense(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user) {
                res.status(401).send("User not authenticated");
                return;
            }
            try {
                const expenseId = req.params.id;
                const updateData = {
                    description: req.body.description,
                    date: req.body.date,
                    value: req.body.value,
                };
                const updatedExpense = yield expenseService_1.ExpenseService.updateExpenseById(req.user._id, expenseId, updateData);
                if (!updatedExpense) {
                    res.status(404).send("Expense not found.");
                    return;
                }
                res.status(201).json(updatedExpense);
            }
            catch (error) {
                res.status(500).send("Error updating expense: " + error.message);
            }
        });
    }
    deleteExpense(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.user) {
                res.status(401).send("User not authenticated");
                return;
            }
            try {
                const expenseId = req.params.id;
                const userId = req.user._id;
                yield expenseService_1.ExpenseService.deleteExpense(expenseId, userId);
                res.status(204).send();
            }
            catch (error) {
                res.status(500).send("Error deleting expense: " + error.message);
            }
        });
    }
}
exports.default = new ExpenseController();
