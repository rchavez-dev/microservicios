const request = require("supertest");
const app = require("../src/app");

describe("API de Tareas - Linea base", () => {
  test("GET /tareas devuelve 200 y la lista inicial", async () => {
    const res = await request(app).get("/tareas");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("POST /tareas crea una nueva tarea y devuelve 201", async () => {
    const res = await request(app)
      .post("/tareas")
      .send({ titulo: "Tarea de prueba" });
    expect(res.statusCode).toBe(201);
    expect(res.body.titulo).toBe("Tarea de prueba");
  });
});
