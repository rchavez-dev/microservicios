const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/app");

const SECRETO = process.env.JWT_SECRET || "clave-para-pruebas-locales";
const tokenValido = jwt.sign({ sub: "u-test", rol: "usuario" }, SECRETO, { expiresIn: "15m" });

describe("API de Tareas - Protegida con JWT", () => {
  test("GET /tareas sin token devuelve 401", async () => {
    const res = await request(app).get("/tareas");
    expect(res.statusCode).toBe(401);
  });

  test("GET /tareas con token valido devuelve 200", async () => {
    const res = await request(app)
      .get("/tareas")
      .set("Authorization", `Bearer ${tokenValido}`);
    expect(res.statusCode).toBe(200);
  });
});
