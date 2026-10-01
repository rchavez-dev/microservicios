require("dotenv").config();

const express = require("express");
const {
  conectar,
  publicarCitaAgendada,
  cerrar
} = require("./cola");

const app = express();
app.use(express.json());

const citas = [];

app.post("/citas", (req, res) => {
  const { pacienteId, medicoId, fecha, hora, motivo, correo } = req.body;

  if (!pacienteId || !medicoId || !fecha || !hora || !correo) {
    return res.status(400).json({
      error: "faltan datos obligatorios"
    });
  }

  // 1) La operación queda confirmada primero.
  const cita = {
    id: "CITA-" + Date.now(),
    pacienteId,
    medicoId,
    fecha,
    hora,
    motivo: motivo || "",
    correo,
    estado: "AGENDADA",
    fechaCreacion: new Date().toISOString()
  };

  citas.push(cita);

  // 2) Recién después se publica el hecho ocurrido.
  publicarCitaAgendada(cita);

  return res.status(201).json(cita);
});

app.get("/citas", (_req, res) => {
  res.json(citas);
});

conectar()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(
        `[productor-citas] API en http://localhost:${process.env.PORT}`
      );
    });
  })
  .catch((e) => {
    console.error("[productor-citas] error:", e.message);
    process.exit(1);
  });

process.on("SIGINT", async () => {
  await cerrar();
  process.exit(0);
});
