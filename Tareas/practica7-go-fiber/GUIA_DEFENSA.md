# Guía corta para defender la práctica

## 1. ¿Qué estamos haciendo?

Estamos probando automáticamente un microservicio REST desarrollado en Go con el framework Fiber.

## 2. ¿Por qué usamos Fiber?

Fiber facilita la creación de rutas y servidores HTTP en Go. Además permite probar las rutas con `app.Test()` sin tener que abrir manualmente el puerto del servidor durante cada prueba.

## 3. ¿Qué es una prueba automatizada?

Es código que ejecuta otra parte del programa y verifica automáticamente si el resultado obtenido coincide con el resultado esperado.

## 4. ¿Qué pruebas tiene el proyecto?

### Pruebas unitarias

Archivo: `internal/services/producto_service_test.go`

Prueban directamente la lógica del servicio de productos sin realizar peticiones HTTP.

Se verifica:
- Listar productos.
- Crear un producto válido.
- Rechazar un producto inválido.
- Buscar un producto inexistente.

### Pruebas de API o integración

Archivo: `tests/api_test.go`

Simulan peticiones HTTP contra las rutas del microservicio.

Se verifica:
- `GET /health` devuelve HTTP 200.
- `GET /api/productos` devuelve productos.
- `POST /api/productos` crea un producto y devuelve HTTP 201.
- Un producto inválido devuelve HTTP 400.
- Un producto que no existe devuelve HTTP 404.

## 5. ¿Qué demuestra esto?

Demuestra que podemos comprobar automáticamente que el microservicio funciona correctamente y detectar errores rápidamente después de modificar el código.

## 6. Conceptos para explicar al docente

- Go: lenguaje de programación.
- Fiber: framework web utilizado con Go.
- Microservicio: aplicación pequeña enfocada en una responsabilidad concreta.
- Endpoint: dirección de la API que recibe una petición.
- Prueba unitaria: prueba una unidad pequeña de lógica de manera aislada.
- Prueba de integración/API: comprueba que varias partes trabajan juntas mediante peticiones HTTP.
- Assert/verificación: comparación entre el resultado esperado y el resultado real.
- Cobertura: porcentaje aproximado del código ejecutado por las pruebas.
