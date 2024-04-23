export type CreateExpenseParams = {
  description: string;
  date: Date;
  user: string;
  value: number;
};

export type ExpenseInterfaceToUpdate = {
  description: string;
  date?: Date;
  value: number;
};
