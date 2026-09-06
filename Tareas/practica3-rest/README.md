# Práctica 3 - Microservicios REST

## Despliegue en Máquina Limpia (Ejercicio 6)

### Requisitos previos
* Docker Desktop (Windows / Mac) o Docker Engine (Linux).
* Docker Compose v2.

---

### Pasos para levantar el proyecto

1. **Clonar el repositorio y entrar a la práctica:**
   ```bash
   git clone https://github.com/rchavez-dev/microservicios/tree/main/Tareas/practica3-rest

2. **Construir y levantar los microservicios con un solo comando:**  
   **En Linux / macOS / PowerShell / Git Bash:**
   cp .env.example .env
   **En Windows (CMD - Símbolo del sistema):**
   copy .env.example .env
3. **Construir y levantar los microservicios con un solo comando:**
docker compose up -d --build

4. **Verificar el estado de salud y orden de inicio (Healthcheck):**
docker compose ps

**Verificación y prueba de endpoints:**

**Documentación interactiva Swagger UI: http://localhost:3000/docs**

**Healthcheck de la API: http://localhost:3000/salud**

**Microservicio consumidor (comunicación interna y respuesta compuesta):**
curl -i http://localhost:4000/resumen
**O abriendo directamente en el navegador: http://localhost:4000/resumen**