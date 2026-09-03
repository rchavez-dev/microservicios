const express = require('express');
const mongoose = require('mongoose');
const os = require('os');
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://mongo_db:27017/inventario_db';

const Producto = mongoose.model('Producto', new mongoose.Schema({
  nombre: { type: String, required: true },
  categoria: { type: String, required: true },
  precio: { type: Number, required: true },
  stock: { type: Number, default: 0 }
}, { timestamps: true }));

// Raíz con host
app.get('/', (req, res) => {
  res.json({
    sistema: "Sistema de Control de Inventario",
    host: os.hostname(),
    estado: "operativo"
  });
});

// Healthcheck endpoint
app.get('/salud', (req, res) => {
  res.json({
    estado: "ok",
    db: mongoose.connection.readyState === 1 ? "conectada" : "desconectada"
  });
});

// CRUD
app.get('/productos', async (req, res) => {
  const productos = await Producto.find();
  res.json(productos);
});

app.post('/productos', async (req, res) => {
  try {
    const nuevo = await Producto.create(req.body);
    res.status(201).json(nuevo);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(PORT, () => console.log(`API en puerto ${PORT}`));
  })
  .catch(err => {
    console.error('Error de base de datos:', err.message);
    process.exit(1);
  });