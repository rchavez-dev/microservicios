# Práctica 7 - Pruebas automatizadas con Go + Fiber

Proyecto académico sencillo para demostrar pruebas automatizadas en un microservicio REST desarrollado en Go utilizando el framework Fiber.

## Qué contiene

- Microservicio REST de productos.
- Framework web Fiber v2.
- Pruebas unitarias de la capa de servicio.
- Pruebas de API/integración usando `httptest` y `app.Test()`.
- Casos exitosos y casos de error.
- Posibilidad de medir cobertura con las herramientas nativas de Go.

## Endpoints

- `GET /health`
- `GET /api/productos`
- `GET /api/productos/:id`
- `POST /api/productos`

## Estructura

```text
practica7-go-fiber/
├── cmd/
│   └── main.go
├── internal/
│   ├── app/app.go
│   ├── handlers/producto_handler.go
│   ├── models/producto.go
│   └── services/
│       ├── producto_service.go
│       └── producto_service_test.go
├── tests/
│   └── api_test.go
├── go.mod
├── README.md
└── GUIA_DEFENSA.md
```

Los comandos de ejecución se explicarán paso a paso durante la práctica.
