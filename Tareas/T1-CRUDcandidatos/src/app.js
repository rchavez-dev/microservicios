require("reflect-metadata");

const express = require("express");
const path = require("path");
const AppDataSource = require("./data-source");
const candidatosRouter = require("./routes/candidatos");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => res.redirect("/candidatos"));
app.use("/candidatos", candidatosRouter);

app.use((req, res) => {
  res.status(404).render("error", {
    title: "Página no encontrada",
    message: "La página solicitada no existe."
  });
});

AppDataSource.initialize()
  .then(() => require("./seed")())
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor: http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error("Error al iniciar:", error);
  });
