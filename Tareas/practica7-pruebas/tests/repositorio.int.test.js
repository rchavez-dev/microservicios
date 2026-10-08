const { MongoDBContainer } = require("@testcontainers/mongodb");
const { crearRepositorio } = require("../src/repositorio");

let contenedor;
let repo;

beforeAll(async () => {
  contenedor = await new MongoDBContainer("mongo:7").start();

  repo = await crearRepositorio(
    contenedor.getConnectionString() + "?directConnection=true"
  );
}, 120000);

beforeEach(async () => {
  await repo.limpiar();
});

afterAll(async () => {
  if (repo) {
    await repo.cerrar();
  }

  if (contenedor) {
    await contenedor.stop();
  }
});

test("guarda una tarea y la recupera por título", async () => {
  await repo.guardar({
    titulo: "Leer Newman",
    completada: false
  });

  const encontrada =
    await repo.buscarPorTitulo("Leer Newman");

  expect(encontrada.completada).toBe(false);
});

test("actualiza el estado de una tarea existente", async () => {
  await repo.guardar({
    titulo: "Estudiar microservicios",
    completada: false
  });

  await repo.actualizarEstado(
    "Estudiar microservicios",
    true
  );

  const encontrada =
    await repo.buscarPorTitulo(
      "Estudiar microservicios"
    );

  expect(encontrada.completada).toBe(true);
});

test("elimina una tarea existente", async () => {
  await repo.guardar({
    titulo: "Tarea temporal",
    completada: false
  });

  await repo.eliminarPorTitulo(
    "Tarea temporal"
  );

  const encontrada =
    await repo.buscarPorTitulo(
      "Tarea temporal"
    );

  expect(encontrada).toBeNull();
});

test("cuenta correctamente las tareas guardadas", async () => {
  await repo.guardar({
    titulo: "Tarea 1",
    completada: false
  });

  await repo.guardar({
    titulo: "Tarea 2",
    completada: false
  });

  const total = await repo.contar();

  expect(total).toBe(2);
});

test("actualizar una tarea inexistente no modifica ningún documento", async () => {
  const resultado =
    await repo.actualizarEstado(
      "No existe",
      true
    );

  expect(resultado.matchedCount).toBe(0);
});