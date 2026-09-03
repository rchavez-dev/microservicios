# Sistema de Control de Inventario (Microservicios COM-600)

Stack multi-contenedor de tres servicios para la gestión de productos e inventario.

## Arquitectura y Componentes
1. **API REST (`api`):** Servicio Node.js/Express construido desde Dockerfile propio con Alpine Linux.
2. **Base de Datos (`mongo`):** MongoDB 7 oficial persistido en volumen nombrado `datos_inventario` y precargado con datos iniciales (seed).
3. **Panel Administrativo (`mongo-express`):** Interfaz web para inspección de datos.

## Requisitos previos
* Docker Engine 24+
* Docker Compose v2

## Cómo levantar el stack (Comando único)
1. Clonar el repositorio y copiar variables de entorno:
   ```bash
   cp .env.example .env