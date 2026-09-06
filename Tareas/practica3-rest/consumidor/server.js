const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const API_URL = process.env.API_URL || "http://api:3000";

// Endpoint compuesto: consume el microservicio de pedidos por red interna
app.get("/resumen", async (req, res) => {
  try {
    const respuesta = await fetch(`${API_URL}/v1/pedidos?limite=100`);
    if (!respuesta.ok) {
      return res.status(502).json({ error: "Error al comunicar con el servicio de pedidos" });
    }
    const datosPedidos = await respuesta.json();
    const pedidos = datosPedidos.datos || [];

    // Lógica compuesta: agrega métricas sobre los datos recibidos
    const totalVentas = pedidos.reduce((acc, p) => acc + (p.total || 0), 0);
    const conteoEstados = pedidos.reduce((acc, p) => {
      acc[p.estado] = (acc[p.estado] || 0) + 1;
      return acc;
    }, {});

    res.json({
      servicio: "Consumidor de Pedidos",
      origen: `${API_URL}/v1/pedidos`,
      totalPedidosAnalizados: pedidos.length,
      sumaTotalVentas: Number(totalVentas.toFixed(2)),
      pedidosPorEstado: conteoEstados
    });
  } catch (err) {
    res.status(500).json({ error: "Fallo de conexión interna", detalle: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Microservicio consumidor activo en puerto ${PORT}`);
});