async function avisar(req, tarea) {
  const inicio = Date.now();

  const r = await fetch("http://localhost:3001/avisos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-correlation-id": req.idCorrelacion
    },
    body: JSON.stringify({ tarea })
  });

  req.registro.info(
    {
      ms: Date.now() - inicio,
      estado: r.status
    },
    "aviso enviado a notificaciones"
  );

  return r.status;
}

module.exports = { avisar };
