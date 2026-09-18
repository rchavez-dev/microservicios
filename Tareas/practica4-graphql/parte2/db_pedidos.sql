CREATE DATABASE IF NOT EXISTS sistema_pedidos;
USE sistema_pedidos;

DROP TABLE IF EXISTS items_pedido;
DROP TABLE IF EXISTS pedidos;

CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mesa_o_cliente VARCHAR(100) NOT NULL,
  fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
  estado VARCHAR(30) DEFAULT 'PENDIENTE',
  total DECIMAL(10,2) DEFAULT 0.00
);

CREATE TABLE items_pedido (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  plato_id INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
);

INSERT INTO pedidos (mesa_o_cliente, estado, total) VALUES
('Mesa 1', 'ENTREGADO', 85.00),
('Mesa 4', 'PENDIENTE', 45.00),
('Cliente Delivery - Richard', 'EN_PREPARACION', 120.00);

INSERT INTO items_pedido (pedido_id, plato_id, cantidad, precio_unitario) VALUES
(1, 101, 2, 35.00),
(1, 103, 1, 15.00),
(2, 102, 1, 45.00),
(3, 101, 2, 35.00),
(3, 102, 1, 45.00),
(3, 104, 1, 5.00);