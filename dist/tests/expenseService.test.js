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
// ExpenseService.test.ts
const expenseService_1 = require("../services/expenseService");
const expense_1 = __importDefault(require("../models/expense"));
const userService_1 = __importDefault(require("../services/userService"));
const mailService_1 = __importDefault(require("../services/mailService"));
const mongoose_1 = __importDefault(require("mongoose"));
jest.mock("../models/expense");
jest.mock("../services/userService");
jest.mock("../services/mailService");
const mockUser = {
    _id: new mongoose_1.default.Types.ObjectId().toString(),
    email: "test@example.com",
};
jest.mock("../middleware/authenticate", () => ({
    authenticate: jest.fn().mockImplementation((req, res, next) => {
        req.user = mockUser;
        next();
    }),
}));
describe("ExpenseService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("findExpensesByUserId", () => {
        it("returns expenses for a given user", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockExpenses = [
                { description: "Lunch", value: 20, user: mockUser._id },
            ];
            expense_1.default.find = jest.fn().mockResolvedValue(mockExpenses);
            const expenses = yield expenseService_1.ExpenseService.findExpensesByUserId(mockUser._id);
            expect(expense_1.default.find).toHaveBeenCalledWith({ user: mockUser._id });
            expect(expenses).toEqual(mockExpenses);
        }));
    });
    describe("createExpense", () => {
        it("creates an expense and sends an email", () => __awaiter(void 0, void 0, void 0, function* () {
            const expenseData = {
                description: "Coffee",
                date: new Date(),
                user: mockUser._id,
                value: 3.5,
            };
            expense_1.default.prototype.save = jest.fn().mockResolvedValue(expenseData);
            userService_1.default.findUserById = jest.fn().mockResolvedValue(mockUser);
            mailService_1.default.sendMail = jest.fn();
            const result = yield expenseService_1.ExpenseService.createExpense(expenseData);
            expect(userService_1.default.findUserById).toHaveBeenCalledWith(mockUser._id);
            expect(expense_1.default.prototype.save).toHaveBeenCalled();
            expect(mailService_1.default.sendMail).toHaveBeenCalledWith(mockUser.email, "Despesa cadastrada com sucesso!", `Uma nova despesa foi registrada: ${expenseData.description}`);
            expect(result).toEqual(expenseData);
        }));
    });
    describe("updateExpenseById", () => {
        it("updates an existing expense", () => __awaiter(void 0, void 0, void 0, function* () {
            const validObjectId = new mongoose_1.default.Types.ObjectId();
            const updateData = {
                description: "Updated Coffee",
                date: new Date(),
                value: 4.0,
            };
            expense_1.default.findById = jest.fn().mockResolvedValue(Object.assign(Object.assign({}, updateData), { user: mockUser._id, _id: validObjectId, save: jest.fn().mockResolvedValue({}) }));
            expense_1.default.findByIdAndUpdate = jest.fn().mockResolvedValue(Object.assign(Object.assign({}, updateData), { user: mockUser._id }));
            const result = yield expenseService_1.ExpenseService.updateExpenseById(mockUser._id, validObjectId.toString(), updateData);
            expect(expense_1.default.findByIdAndUpdate).toHaveBeenCalledWith(validObjectId.toString(), updateData, { new: true });
            expect(result).toEqual(expect.anything());
        }));
    });
    describe("deleteExpense", () => {
        it("deletes an expense", () => __awaiter(void 0, void 0, void 0, function* () {
            const validObjectId = new mongoose_1.default.Types.ObjectId();
            expense_1.default.findById = jest.fn().mockResolvedValue({
                _id: validObjectId,
                user: mockUser._id,
                delete: jest.fn().mockResolvedValue({}),
            });
            expense_1.default.findByIdAndDelete = jest.fn().mockResolvedValue({});
            yield expenseService_1.ExpenseService.deleteExpense(validObjectId.toString(), mockUser._id);
            expect(expense_1.default.findById).toHaveBeenCalledWith(validObjectId.toString());
            expect(expense_1.default.findByIdAndDelete).toHaveBeenCalledWith(validObjectId.toString());
        }));
    });
});
