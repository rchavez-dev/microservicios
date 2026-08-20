const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const User = require("./models/User");
const app = express();
const path = require("path");
// Configuración
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method")); // Para soportar PUT y DELETE
app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));


// Conexión a MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/usuarios226", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// Rutas
app.get("/", async (req, res) => {
  const users = await User.find();
  res.render("index", { users });
});
app.get("/users/new", (req, res) => {
  res.render("create");
});
app.post("/users", async (req, res) => {
  const { correo, password, nombre, rol } = req.body;
  await User.create({ correo, password, nombre, rol });
  res.redirect("/");
});
app.get("/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.render("show", { user });
});
app.get("/users/:id/edit", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.render("edit", { user });
});
app.put("/users/:id", async (req, res) => {
  const { correo, password, nombre, rol } = req.body;
  await User.findByIdAndUpdate(req.params.id, {
    correo,
    password,
    nombre,
    rol,
  });
  res.redirect("/");
});
app.delete("/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.redirect("/");
});
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
