const app = require("./src/app");
const { registro } = require("./src/registro");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  registro.info(
    { puerto: PORT },
    "servidor iniciado"
  );
});