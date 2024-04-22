import Expense, { IExpense } from "../models/expense";
import moment from "moment";
import UserService from "../services/userService";
import MailService from "../services/mailService";
import { expenseInterface } from "../interfaces/expense.interface";

export class ExpenseService {
  static async findExpensesByUserId(
    requesterId: string
  ): Promise<Array<IExpense>> {
    return await Expense.find({ user: requesterId });
  }

  static async findExpenseById(
    expenseId: string,
    userId: string
  ): Promise<expenseInterface> {
    const expense = await Expense.findOne({ _id: expenseId });
    if (!expense) throw new Error("Expense not found.");
    ExpenseService.checkExpenseOwnership(expense, userId);
    return expense;
  }

  static async createExpense(data: {
    description: string;
    date: Date;
    user: string;
    value: number;
  }): Promise<expenseInterface> {
    if (data.value < 0) throw new Error("Value cannot be negative.");
    const userExists = await UserService.findUserById(data.user);
    if (!userExists) throw new Error("User not found.");
    ExpenseService.validateDate(data.date);
    const newExpense = new Expense({
      ...data,
      date: moment(data.date, "DD/MM/YYYY").startOf("day").toDate(),
    });

    const savedExpense = await newExpense.save();
    if (savedExpense) {
      await MailService.sendMail(
        userExists.email,
        "Despesa cadastrada com sucesso!",
        `Uma nova despesa foi registrada: ${savedExpense.description}`
      );
    }
    return savedExpense;
  }

  static async updateExpenseById(
    authUserId: string,
    expenseId: string,
    updateData: {
      description: string;
      date?: Date;
      value: number;
    }
  ): Promise<expenseInterface | null> {
    let cleanUpdateData = { ...updateData };
    if (cleanUpdateData.date === undefined) {
      delete cleanUpdateData.date;
    }

    if (updateData.value < 0) throw new Error("Value cannot be negative.");
    const expense = await Expense.findById(expenseId);

    if (!expense) throw new Error("Expense not found.");
    ExpenseService.checkExpenseOwnership(expense, authUserId);
    if (updateData.date) ExpenseService.validateDate(updateData.date);
    return await Expense.findByIdAndUpdate(expenseId, cleanUpdateData, {
      new: true,
    });
  }

  static async deleteExpense(expenseId: string, userId: string): Promise<void> {
    const expense = await Expense.findById(expenseId);
    if (!expense) throw new Error("Expense not found.");
    ExpenseService.checkExpenseOwnership(expense, userId);
    await Expense.findByIdAndDelete(expenseId);
  }

  private static checkExpenseOwnership(expense: IExpense, userId: string) {
    if (expense.user.toString() !== userId.toString()) {
      throw new Error(
        "Unauthorized access, the user is not the owner of the expense."
      );
    }
  }

  private static validateDate(date: Date) {
    if (!date) return;
    const parsedDate = moment(date, "DD/MM/YYYY").startOf("day");
    if (parsedDate.isAfter(moment().startOf("day"))) {
      throw new Error("Date cannot be in the future.");
    }
  }
}
