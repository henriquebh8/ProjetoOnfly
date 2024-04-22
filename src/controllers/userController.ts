import { Request, Response } from "express";
import UserService from "../services/userService";
import { userInterface } from "../interfaces/user.interface";

class UserController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await UserService.createUser(email, password);
      res.status(201).send(user);
    } catch (error: any) {
      res.status(500).send("Error registering new user: " + error.message);
    }
  }

  async findUser(req: Request, res: Response): Promise<userInterface | any> {
    try {
      const { _id } = req.body;
      const user = await UserService.findUserById(_id);
      if (!user) {
        return res.status(404).send("User not found.");
      }
      res.status(200).send(user);
    } catch (error: any) {
      res.status(500).send("Error finding user: " + error.message);
    }
    return undefined;
  }
}

export default new UserController();
