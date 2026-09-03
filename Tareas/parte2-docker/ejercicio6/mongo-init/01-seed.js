db = db.getSiblingDB('inventario_db');

db.productos.insertMany([
  { nombre: "Laptop ThinkPad", categoria: "Computación", precio: 1200, stock: 15 },
  { nombre: "Mouse Inalámbrico", categoria: "Accesorios", precio: 25, stock: 50 },
  { nombre: "Teclado Mecánico", categoria: "Accesorios", precio: 75, stock: 30 },
  { nombre: "Monitor 24 IPS", categoria: "Pantallas", precio: 180, stock: 20 },
  { nombre: "Disco SSD 1TB NVMe", categoria: "Almacenamiento", precio: 95, stock: 40 }
]);