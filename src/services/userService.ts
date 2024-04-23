import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user";
import { JWT_SECRET } from "../config/config";

class UserService {
  async createUser(email: string, password: string): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
    });
    return user.save();
  }

  async validatePassword(user: IUser, inputPassword: string): Promise<boolean> {
    return bcrypt.compare(inputPassword, user.password);
  }

  generateToken(user: IUser): string {
    return jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "6h" });
  }

  findUserById(userId: string): Promise<IUser | null> {
    return User.findById(userId).exec();
  }
}

export default new UserService();
