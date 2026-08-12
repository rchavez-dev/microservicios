# CRUD Candidatos - Elecciones Universitarias USFX

Proyecto académico realizado con Node.js, JavaScript, Express, TypeORM, SQLite3 y EJS.

## Enunciado implementado

CRUD únicamente para la tabla **Candidatos**:

- ci VARCHAR(12)
- nombres VARCHAR(60)
- apellido1 VARCHAR(30)
- apellido2 VARCHAR(40)
- cargo_id INT
- lugar_id INT

Tablas auxiliares:

### cargos
- id
- nombre

Los cargos corresponden a elecciones universitarias, por ejemplo:
- Rector
- Vicerrector
- Decano
- Vicedecano
- Director de Carrera
- Jefe de Departamento
- Representante Docente
- Representante Estudiantil

### lugar
- id
- nombre

Los lugares corresponden a facultades/unidades académicas de la USFX en Sucre.

## Importante

La aplicación tiene **un solo CRUD: Candidatos**.

Los cargos y lugares NO tienen CRUD. Son catálogos precargados para ser seleccionados desde el formulario de candidatos.

## Instalación

```bash
npm install
npm start
```

Abrir:

http://localhost:3000

La base de datos se crea automáticamente en:

data/candidatos.sqlite

## Operaciones

El CRUD permite:

1. Crear candidato
2. Listar candidatos
3. Consultar detalle
4. Editar candidato
5. Eliminar candidato

Los campos `cargo_id` y `lugar_id` aparecen como listas desplegables mostrando sus nombres.

## Tecnología

- Node.js
- Express
- JavaScript
- TypeORM
- SQLite3
- EJS
- HTML/CSS
