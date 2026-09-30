CREATE TABLE IF NOT EXISTS pacientes (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  ci VARCHAR(30) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  telefono VARCHAR(30) NOT NULL,
  seguro VARCHAR(100) NOT NULL
);
INSERT INTO pacientes (ci,nombre,apellido,fecha_nacimiento,telefono,seguro) VALUES
('1000001','Ana','Flores','1998-05-10','70000001','SUS'),
('1000002','Luis','Rojas','1989-08-15','70000002','Caja Nacional'),
('1000003','Maria','Perez','2002-02-20','70000003','SUS'),
('1000004','Carlos','Vargas','1979-12-05','70000004','Privado'),
('1000005','Sofia','Mendez','1995-07-22','70000005','SUS');
