import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import mongoose from "mongoose";
import { MONGO_URI } from "./config/config";
import authRoutes from "./routes/authRoutes";
import expenseRoutes from "./routes/expenseRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connection ready."))
  .catch(err => console.error("Error connecting to MongoDB:", err));

app.use("/login", authRoutes);
app.use("/expenses", expenseRoutes);
app.use("/", userRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).send("Something broke!");
});

export default app;
