require("dotenv").config();
const app = require("./app");
const { conectar } = require("./repositorio");

const PORT = process.env.PORT || 3000;

conectar()
  .then(() => {
    console.log("Conectado a MongoDB con éxito");
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error al conectar a MongoDB:", err);
    process.exit(1);
  });
  