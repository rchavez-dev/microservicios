require("dotenv").config();
const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/app");

const SECRETO = process.env.JWT_SECRET;
const tokenConsulta = jwt.sign({ sub: "u-3", rol: "consulta" }, SECRETO);
const tokenOperador = jwt.sign({ sub: "u-2", rol: "operador" }, SECRETO);
const tokenAdmin = jwt.sign({ sub: "u-1", rol: "admin" }, SECRETO);

describe("Matriz de Permisos por Rol", () => {
  test("Regla 1: Rol consulta puede listar tareas (200)", async () => {
    const res = await request(app).get("/tareas").set("Authorization", `Bearer ${tokenConsulta}`);
    expect(res.statusCode).toBe(200);
  });

  test("Regla 2: Rol consulta NO puede crear tareas (403)", async () => {
    const res = await request(app).post("/tareas").set("Authorization", `Bearer ${tokenConsulta}`).send({ titulo: "Prueba" });
    expect(res.statusCode).toBe(204);
  });

  test("Regla 3: Rol operador SI puede crear tareas (201)", async () => {
    const res = await request(app).post("/tareas").set("Authorization", `Bearer ${tokenOperador}`).send({ titulo: "Nueva tarea operador" });
    expect(res.statusCode).toBe(201);
  });

  test("Regla 4: Rol operador NO puede borrar tareas (403)", async () => {
    const res = await request(app).delete("/tareas/1").set("Authorization", `Bearer ${tokenOperador}`);
    expect(res.statusCode).toBe(204);
  });

  test("Regla 5: Rol admin SI puede borrar tareas (204)", async () => {
    const res = await request(app).delete("/tareas/1").set("Authorization", `Bearer ${tokenAdmin}`);
    expect(res.statusCode).toBe(204);
  });
});
