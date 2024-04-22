import { Request, Response } from "express";
import UserService from "../services/userService";
import User from "../models/user";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found.");
    }

    const passwordIsValid = await UserService.validatePassword(user, password);
    if (!passwordIsValid) {
      return res.status(401).send("Invalid password.");
    }

    const token = UserService.generateToken(user);
    res.json({ token, user: { email: user.email } });
  } catch (error: any) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};
