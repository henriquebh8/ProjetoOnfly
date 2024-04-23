import jwt from "jsonwebtoken";
import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import { MONGO_URI, JWT_SECRET } from "../config/config";

// o valor do _id é necessario para rodar os testes.
const token = jwt.sign({ _id: "6625f08688e2ac2e052e01f7" }, JWT_SECRET, {
  expiresIn: "6h",
});

const mockedJwt = require("jsonwebtoken");
let createdExpenseId: string;
let createdExpenseUserId: string;
beforeAll(async () => {
  await mongoose.connect(MONGO_URI);
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe("Unnauthenticated requests", () => {
  it("requires authorization", async () => {
    const response = await request(app).get(
      "/expenses/all/6623ff687b47d279bae00121"
    );
    expect(response.status).toBe(401);
  });
});

describe("POST /expenses", () => {
  it("should add a new expense", async () => {
    const newExpense = {
      description: "Lunch",
      date: "20/05/2023",
      value: 15.75,
    };
    const res = await request(app)
      .post("/expenses/")
      .send(newExpense)
      .set("Authorization", token)
      .set("Content-Type", "application/json");
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    createdExpenseId = res.body._id;
    createdExpenseUserId = res.body.user;
  });
});

describe("quando busco as despesas pelo id do usuario", () => {
  it("returns expenses for a valid user", async () => {
    const response = await request(app)
      .get(`/expenses/all/${createdExpenseUserId}`)
      .set("Authorization", token);

    expect(response.status).toBe(200);
  });
});

describe("GET /expenses/expense/:id", () => {
  it("should fetch a single expense by id", async () => {
    const res = await request(app)
      .get(`/expenses/expense/${createdExpenseId}`)
      .set("Authorization", token);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("description");
  });

  it("should fail to fetch expense for unauthorized user", async () => {
    const res = await request(app).get(`/expenses/expense/${createdExpenseId}`);
    expect(res.status).toBe(401);
  });
});

describe("PUT /expenses/:id", () => {
  it("should update an expense", async () => {
    const updates = {
      description: "Updated Lunch",
      value: 20.01,
    };
    const res = await request(app)
      .put(`/expenses/${createdExpenseId}`)
      .send(updates)
      .set("Authorization", token);
    expect(res.status).toBe(201);
    expect(res.body.description).toBe("Updated Lunch");
  });
});

describe("DELETE /expenses/:id", () => {
  it("should delete an expense", async () => {
    const res = await request(app)
      .delete(`/expenses/${createdExpenseId}`)
      .set("Authorization", token);
    expect(res.status).toBe(204);
  });
});
