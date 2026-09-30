# Clínica San Xavier — Primer parcial de Microservicios COM-600

Tres microservicios con bases distintas, comunicación solo síncrona y Docker Compose:

- **ms-pacientes**: Express REST, MySQL 8, puerto publicado `3001`.
- **ms-medicos**: servidor gRPC, PostgreSQL 16, puerto `50051` **solo interno**.
- **ms-citas**: GraphQL BFF, MongoDB 7, puerto publicado `4000`. Hace solicitudes REST a pacientes y gRPC a médicos.

## Archivos

```text
clinica-san-xavier/
├── .env                  
├── .env.example        
├── .gitignore
├── docker-compose.yml
├── README.md
├── ms-pacientes/
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   ├── db/init.sql
│   └── src/server.js
├── ms-medicos/
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   ├── db/init.sql
│   ├── proto/medicos.proto
│   └── src/server.js
├── ms-citas/
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   ├── proto/medicos.proto
│   └── src/server.js

```

## Importante para uso sin internet

Los Dockerfile **no ejecutan npm install** para cumplir el enunciado y parten de `com600/node-base:1.0`. Es necesario que dicha imagen tenga las dependencias de Node accesibles con `require()` en `/app` (o en una ruta `NODE_PATH` configurada), y que las imágenes `mysql:8.0`, `postgres:16` y `mongo:7` ya estén disponibles localmente. **El ZIP contiene el código fuente, no las imágenes de Docker ni los node_modules**. Sin esas dependencias/imágenes no es posible garantizar arranque sin internet. Las versiones de package.json son una referencia de las librerías requeridas.

Comprobar librerías en la imagen base:

```bash
docker run --rm com600/node-base:1.0 node -e "for(const p of ['express','mysql2','pg','mongodb','graphql','@grpc/grpc-js','@grpc/proto-loader']){try{console.log(p,require.resolve(p))}catch(e){console.log('FALTA',p)}}"
```

En `.env` define contraseñas apropiadas. Están incluidas credenciales **de ejemplo solo para pruebas locales**. Nunca subas `.env` al repositorio.

## Iniciar

```bash
cd clinica-san-xavier
docker compose config
docker compose up -d --build
docker compose ps
docker compose logs -f
```

Si no hay acceso a Internet y las imágenes ya están cargadas, puedes usar `docker compose build --pull=false` antes de `docker compose up -d --no-build`.

Los archivos SQL se ejecutan automáticamente **solo durante la primera inicialización** del volumen correspondiente.

## Probar REST

```bash
curl http://localhost:3001/api/v1/salud
curl 'http://localhost:3001/api/v1/pacientes?pagina=2&tam=2'
curl http://localhost:3001/api/v1/pacientes/1
bash pruebas/probar-rest.sh
```

## Probar GraphQL

```bash
curl -s http://localhost:4000/salud
curl -s -X POST http://localhost:4000/graphql -H 'Content-Type: application/json' \
  -d '{"query":"{ medicos { id nombre especialidad matricula } }"}'
curl -s -X POST http://localhost:4000/graphql -H 'Content-Type: application/json' \
  -d '{"query":"{ horariosDisponibles(medicoId:1) { id fecha hora disponible } }"}'
```

En `pruebas/ejemplos.graphql` hay consultas y mutaciones listas para copiar en Postman. Para agendar, reemplaza `horarioId` por uno disponible del médico indicado. La mutación devuelve un `id` de MongoDB que se utiliza para cancelar.

## Comportamientos exigidos

- Pacientes: 5 iniciales, GET paginado (tam máximo 50), GET ID, POST con Location, PUT, DELETE, respuestas 200/201/204/404/409/422 y errores JSON con `codigo` y `mensaje`.
- Médicos: 4 iniciales, horarios libres, los 5 RPC, streaming de horarios, reserva atómica mediante `UPDATE ... WHERE disponible=TRUE`.
- Citas: 5 queries/mutations indicadas, subcampos anidados paciente vía REST y médico vía gRPC, timeout 3 s, validación paciente, validación de pertenencia horario/médico, compensación `LiberarHorario` si falla el INSERT en Mongo, cancelación libera horario y marca CANCELADA.
- Infraestructura: 6 contenedores, una red bridge, 3 volúmenes, healthchecks y `depends_on` service_healthy, nada de puertos publicados para las bases de datos.

### Limitación de fallos distribuidos

La compensación maneja un fallo de inserción normal, pero si hay un cierre abrupto del proceso entre RPC/INSERT o pérdida de la respuesta de una RPC, puede requerirse recuperación manual. En producción se necesitarían mensajes duraderos/outbox y reconciliación. Asimismo, un fallo de Mongo **después** de liberar un horario durante la cancelación requiere intervención/reconciliación. Son limitaciones a considerar al explicar el ejercicio.
