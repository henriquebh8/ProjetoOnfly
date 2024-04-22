import mongoose, { Document } from "mongoose";
import { IUser } from "./user";

export interface IExpense extends Document {
  description: string;
  date?: Date;
  user: IUser["_id"];
  value: number;
}

const expenseSchema = new mongoose.Schema({
  description: { type: String, required: true, maxlength: 191 },
  date: { type: Date, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  value: { type: Number, required: true, min: 0 },
});

export default mongoose.model<IExpense>("Expense", expenseSchema);
