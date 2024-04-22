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
exports.ExpenseService = void 0;
const expense_1 = __importDefault(require("../models/expense"));
const moment_1 = __importDefault(require("moment"));
const userService_1 = __importDefault(require("../services/userService"));
const mailService_1 = __importDefault(require("../services/mailService"));
class ExpenseService {
    static findExpensesByUserId(requesterId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield expense_1.default.find({ user: requesterId });
        });
    }
    static findExpenseById(expenseId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const expense = yield expense_1.default.findOne({ _id: expenseId });
            if (!expense)
                throw new Error("Expense not found.");
            ExpenseService.checkExpenseOwnership(expense, userId);
            return expense;
        });
    }
    static createExpense(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.value < 0)
                throw new Error("Value cannot be negative.");
            const userExists = yield userService_1.default.findUserById(data.user);
            if (!userExists)
                throw new Error("User not found.");
            ExpenseService.validateDate(data.date);
            const newExpense = new expense_1.default(Object.assign(Object.assign({}, data), { date: (0, moment_1.default)(data.date, "DD/MM/YYYY").startOf("day").toDate() }));
            const savedExpense = yield newExpense.save();
            if (savedExpense) {
                yield mailService_1.default.sendMail(userExists.email, "Despesa cadastrada com sucesso!", `Uma nova despesa foi registrada: ${savedExpense.description}`);
            }
            return savedExpense;
        });
    }
    static updateExpenseById(authUserId, expenseId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            let cleanUpdateData = Object.assign({}, updateData);
            if (cleanUpdateData.date === undefined) {
                delete cleanUpdateData.date;
            }
            if (updateData.value < 0)
                throw new Error("Value cannot be negative.");
            const expense = yield expense_1.default.findById(expenseId);
            if (!expense)
                throw new Error("Expense not found.");
            ExpenseService.checkExpenseOwnership(expense, authUserId);
            if (updateData.date)
                ExpenseService.validateDate(updateData.date);
            return yield expense_1.default.findByIdAndUpdate(expenseId, cleanUpdateData, {
                new: true,
            });
        });
    }
    static deleteExpense(expenseId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const expense = yield expense_1.default.findById(expenseId);
            if (!expense)
                throw new Error("Expense not found.");
            ExpenseService.checkExpenseOwnership(expense, userId);
            yield expense_1.default.findByIdAndDelete(expenseId);
        });
    }
    static checkExpenseOwnership(expense, userId) {
        if (expense.user.toString() !== userId.toString()) {
            throw new Error("Unauthorized access, the user is not the owner of the expense.");
        }
    }
    static validateDate(date) {
        if (!date)
            return;
        const parsedDate = (0, moment_1.default)(date, "DD/MM/YYYY").startOf("day");
        if (parsedDate.isAfter((0, moment_1.default)().startOf("day"))) {
            throw new Error("Date cannot be in the future.");
        }
    }
}
exports.ExpenseService = ExpenseService;
