import { Request, Response } from "express";
import UserService from "../services/userService";

class UserController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await UserService.createUser(email, password);
      res.status(201).send(user);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).send("Error registering new user: " + error.message);
      }
    }
  }

  async findUser(req: Request, res: Response): Promise<void> {
    try {
      const { _id } = req.body;
      const user = await UserService.findUserById(_id);
      if (!user) {
        res.status(404).send("User not found.");
        return;
      }
      res.status(200).send(user);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).send("Error finding user: " + error.message);
      }
    }
    return;
  }
}

export default new UserController();
