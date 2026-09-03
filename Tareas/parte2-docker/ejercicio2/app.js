const express = require('express');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({
    servicio: 'Microservicio de Demostración - Ejercicio 1',
    estado: 'activo',
    host_contenedor: os.hostname(),
    sistema_operativo: os.type() + ' ' + os.release(),
    fecha_consulta: new Date().toISOString()
  });
});

app.get('/salud', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: Date.now() });
});

app.listen(PORT, () => {
  console.log(`Servidor activo en el puerto ${PORT}`);
});