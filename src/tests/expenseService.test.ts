// ExpenseService.test.ts
import { ExpenseService } from "../services/expenseService";
import Expense from "../models/expense";
import UserService from "../services/userService";
import MailService from "../services/mailService";
import mongoose from "mongoose";

jest.mock("../models/expense");
jest.mock("../services/userService");
jest.mock("../services/mailService");

const mockUser = {
  _id: new mongoose.Types.ObjectId().toString(),
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
    it("returns expenses for a given user", async () => {
      const mockExpenses = [
        { description: "Lunch", value: 20, user: mockUser._id },
      ];
      Expense.find = jest.fn().mockResolvedValue(mockExpenses);

      const expenses = await ExpenseService.findExpensesByUserId(mockUser._id);
      expect(Expense.find).toHaveBeenCalledWith({ user: mockUser._id });
      expect(expenses).toEqual(mockExpenses);
    });
  });

  describe("createExpense", () => {
    it("creates an expense and sends an email", async () => {
      const expenseData = {
        description: "Coffee",
        date: new Date(),
        user: mockUser._id,
        value: 3.5,
      };

      Expense.prototype.save = jest.fn().mockResolvedValue(expenseData);
      UserService.findUserById = jest.fn().mockResolvedValue(mockUser);
      MailService.sendMail = jest.fn();

      const result = await ExpenseService.createExpense(expenseData);
      expect(UserService.findUserById).toHaveBeenCalledWith(mockUser._id);
      expect(Expense.prototype.save).toHaveBeenCalled();
      expect(MailService.sendMail).toHaveBeenCalledWith(
        mockUser.email,
        "Despesa cadastrada com sucesso!",
        `Uma nova despesa foi registrada: ${expenseData.description}`
      );
      expect(result).toEqual(expenseData);
    });
  });

  describe("updateExpenseById", () => {
    it("updates an existing expense", async () => {
      const validObjectId = new mongoose.Types.ObjectId();
      const updateData = {
        description: "Updated Coffee",
        date: new Date(),
        value: 4.0,
      };
      Expense.findById = jest.fn().mockResolvedValue({
        ...updateData,
        user: mockUser._id,
        _id: validObjectId,
        save: jest.fn().mockResolvedValue({}),
      });

      Expense.findByIdAndUpdate = jest.fn().mockResolvedValue({
        ...updateData,
        user: mockUser._id,
      });

      const result = await ExpenseService.updateExpenseById(
        mockUser._id,
        validObjectId.toString(),
        updateData
      );
      expect(Expense.findByIdAndUpdate).toHaveBeenCalledWith(
        validObjectId.toString(),
        updateData,
        { new: true }
      );
      expect(result).toEqual(expect.anything());
    });
  });

  describe("deleteExpense", () => {
    it("deletes an expense", async () => {
      const validObjectId = new mongoose.Types.ObjectId();
      Expense.findById = jest.fn().mockResolvedValue({
        _id: validObjectId,
        user: mockUser._id,
        delete: jest.fn().mockResolvedValue({}),
      });

      Expense.findByIdAndDelete = jest.fn().mockResolvedValue({});

      await ExpenseService.deleteExpense(
        validObjectId.toString(),
        mockUser._id
      );
      expect(Expense.findById).toHaveBeenCalledWith(validObjectId.toString());
      expect(Expense.findByIdAndDelete).toHaveBeenCalledWith(
        validObjectId.toString()
      );
    });
  });
});
