"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config/config");
const token = jsonwebtoken_1.default.sign({ _id: "6623ff687b47d279bae00121" }, config_1.JWT_SECRET, {
    expiresIn: "6h",
});
const mockedJwt = require("jsonwebtoken");
let createdExpenseId;
let createdExpenseUserId;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect(config_1.MONGO_URI);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect();
}));
describe("Unnauthenticated requests", () => {
    it("requires authorization", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default).get("/expenses/all/6623ff687b47d279bae00121");
        expect(response.status).toBe(401);
    }));
});
describe("POST /expenses", () => {
    it("should add a new expense", () => __awaiter(void 0, void 0, void 0, function* () {
        const newExpense = {
            description: "Lunch",
            date: "20/05/2023",
            value: 15.75,
        };
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/expenses/")
            .send(newExpense)
            .set("Authorization", token)
            .set("Content-Type", "application/json");
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("_id");
        createdExpenseId = res.body._id;
        createdExpenseUserId = res.body.user;
    }));
});
describe("quando busco as despesas pelo id do usuario", () => {
    it("returns expenses for a valid user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get(`/expenses/all/${createdExpenseUserId}`)
            .set("Authorization", token);
        expect(response.status).toBe(200);
    }));
});
describe("GET /expenses/expense/:id", () => {
    it("should fetch a single expense by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get(`/expenses/expense/${createdExpenseId}`)
            .set("Authorization", token);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("description");
    }));
    it("should fail to fetch expense for unauthorized user", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get(`/expenses/expense/${createdExpenseId}`);
        expect(res.status).toBe(401);
    }));
});
describe("PUT /expenses/:id", () => {
    it("should update an expense", () => __awaiter(void 0, void 0, void 0, function* () {
        const updates = {
            description: "Updated Lunch",
            value: 20.01,
        };
        const res = yield (0, supertest_1.default)(app_1.default)
            .put(`/expenses/${createdExpenseId}`)
            .send(updates)
            .set("Authorization", token);
        expect(res.status).toBe(201);
        expect(res.body.description).toBe("Updated Lunch");
    }));
});
describe("DELETE /expenses/:id", () => {
    it("should delete an expense", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .delete(`/expenses/${createdExpenseId}`)
            .set("Authorization", token);
        expect(res.status).toBe(204);
    }));
});
