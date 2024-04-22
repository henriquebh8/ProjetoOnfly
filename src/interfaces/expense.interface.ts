import { IExpense } from "../models/expense";

export interface expenseInterface extends IExpense {
  description: string;
  date?: Date;
  user: string;
  value: number;
}
