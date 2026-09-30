CREATE TABLE medicos (id SERIAL PRIMARY KEY, nombre VARCHAR(120) NOT NULL, especialidad VARCHAR(120) NOT NULL, matricula VARCHAR(40) NOT NULL UNIQUE);
CREATE TABLE horarios (id SERIAL PRIMARY KEY, medico_id INT NOT NULL REFERENCES medicos(id), fecha DATE NOT NULL, hora TIME NOT NULL, disponible BOOLEAN NOT NULL DEFAULT TRUE, UNIQUE(medico_id,fecha,hora));
INSERT INTO medicos(nombre,especialidad,matricula) VALUES ('Elena Quiroga','Cardiologia','MED-001'),('Jorge Lima','Pediatria','MED-002'),('Rosa Arce','Traumatologia','MED-003'),('Pablo Torres','Medicina General','MED-004');
-- Horarios relativos al momento del primer arranque, para que los ejemplos sigan siendo útiles.
INSERT INTO horarios(medico_id,fecha,hora) SELECT m.id, CURRENT_DATE + d.n, h.hora::time FROM medicos m CROSS JOIN (VALUES (1),(2),(3)) d(n) CROSS JOIN (VALUES ('09:00'),('10:00'),('11:00')) h(hora);
