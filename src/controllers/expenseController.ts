import { Request, Response } from "express";
import { ExpenseService } from "../services/expenseService";
import { expenseInterface } from "../interfaces/expense.interface";
import { IExpense } from "../models/expense";

class ExpenseController {
  async getExpenses(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).send("User not authenticated");
      return;
    }
    try {
      const sessionUserId = req.user.id;
      const expenses = await ExpenseService.findExpensesByUserId(sessionUserId);
      res.json(expenses);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).send("Error retrieving expenses: " + error.message);
      }
    }
  }

  async getExpenseById(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).send("User not authenticated");
      return;
    }
    try {
      const expenseId = req.params.id;
      const userId = req.user._id;
      const expense = await ExpenseService.findExpenseById(expenseId, userId);
      if (!expense) {
        res.status(404).send("Expense not found.");
        return;
      }
      res.json(expense);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).send("Error retrieving expense: " + error.message);
      }
    }
  }

  async addExpense(req: Request, res: Response): Promise<void> {
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
      const newExpense = await ExpenseService.createExpense(expenseData);
      res.status(201).json(newExpense);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).send("Error adding expense: " + error.message);
      }
    }
  }

  async updateExpense(req: Request, res: Response): Promise<void> {
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
      const updatedExpense = await ExpenseService.updateExpenseById(
        req.user._id,
        expenseId,
        updateData
      );
      if (!updatedExpense) {
        res.status(404).send("Expense not found.");
        return;
      }
      res.status(201).json(updatedExpense);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).send("Error updating expense: " + error.message);
      }
    }
  }

  async deleteExpense(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).send("User not authenticated");
      return;
    }
    try {
      const expenseId = req.params.id;
      const userId = req.user._id;
      await ExpenseService.deleteExpense(expenseId, userId);
      res.status(204).send();
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).send("Error deleting expense: " + error.message);
      }
    }
  }
}

export default new ExpenseController();
