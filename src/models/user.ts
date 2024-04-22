import mongoose, { Document } from "mongoose";
import validator from "validator";

export interface IUser extends Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email address is required"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
});

export default mongoose.model<IUser>("User", userSchema);
