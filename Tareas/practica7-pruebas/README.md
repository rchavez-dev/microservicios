# Práctica 7 - Pruebas Automatizadas de un Microservicio

## Descripción

Proyecto desarrollado para la Práctica N.º 7 de la asignatura COM-600 Microservicios.

El proyecto contiene pruebas automatizadas:

- Pruebas unitarias
- Pruebas de integración HTTP
- Pruebas de integración con MongoDB usando Testcontainers
- Pruebas de contrato
- Reporte de cobertura con Jest

---

## Requisitos

Para ejecutar el proyecto se necesita:

- Node.js 20 o superior
- npm 10 o superior
- Docker
- Git

Verificar versiones:

```bash
node --version
npm --version
docker --version
git --version
```

También verificar que Docker esté funcionando:

```bash
docker ps
```

---

## Instalación

Clonar el repositorio:

```bash
git clone URL_DEL_REPOSITORIO
```

Entrar a la carpeta:

```bash
cd practica7-pruebas
```

Instalar las dependencias:

```bash
npm install
```

---

## Ejecutar todas las pruebas

```bash
npm test
```

Este comando ejecuta toda la suite de pruebas usando Jest.

---

## Ejecutar pruebas unitarias y rápidas

```bash
npm run test:unit
```

Este comando ejecuta las pruebas rápidas y excluye las pruebas de integración con contenedores.

---

## Ejecutar pruebas de integración

```bash
npm run test:int
```

Este comando ejecuta las pruebas de integración que utilizan MongoDB mediante Testcontainers.

Docker debe estar iniciado antes de ejecutar estas pruebas.

---

## Ejecutar cobertura

```bash
npm run test:cov
```

El reporte HTML de cobertura se genera en:

```text
coverage/lcov-report/index.html
```

En Linux puede abrirse con:

```bash
xdg-open coverage/lcov-report/index.html
```

---

## Tiempos aproximados

Los tiempos pueden cambiar dependiendo del equipo.

- Pruebas unitarias y HTTP: menos de 1 segundo
- Prueba de integración con MongoDB: aproximadamente 7 a 15 segundos
- Suite completa: aproximadamente 8 a 20 segundos

La primera ejecución puede tardar más si Docker necesita descargar la imagen de MongoDB.

---

## Estructura del proyecto

```text
practica7-pruebas/
├── contratos/
│   └── tarea-creada.contrato.json
├── src/
│   ├── app.js
│   ├── eventos.js
│   ├── repositorio.js
│   └── tarea.js
├── tests/
│   ├── api.test.js
│   ├── contrato.test.js
│   ├── repositorio.int.test.js
│   └── tarea.test.js
├── .gitignore
├── jest.config.js
├── package.json
├── package-lock.json
└── README.md
```

---

## Archivos principales

### `src/tarea.js`

Contiene la función `estadoDeTarea`, utilizada para determinar si una tarea está:

- COMPLETADA
- ATRASADA
- PENDIENTE

### `src/app.js`

Contiene la aplicación Express utilizada para probar los endpoints HTTP sin levantar el servidor manualmente.

### `src/repositorio.js`

Contiene las operaciones para trabajar con MongoDB.

### `src/eventos.js`

Contiene la función encargada de construir el evento `TareaCreada`.

### `contratos/tarea-creada.contrato.json`

Define el contrato del evento `TareaCreada`, incluyendo los campos obligatorios y sus tipos.

---

## Scripts disponibles

Los scripts definidos en `package.json` son:

```json
{
  "scripts": {
    "test": "jest --runInBand",
    "test:unit": "jest --testPathIgnorePatterns int.test",
    "test:int": "jest int.test --runInBand",
    "test:cov": "jest --coverage"
  }
}
```

---

## Código de salida

Cuando todas las pruebas pasan correctamente:

```bash
npm test
echo $?
```

El código esperado es:

```text
0
```

Cuando alguna prueba falla, el código de salida es distinto de `0`.

---

## Docker y Testcontainers

Las pruebas de integración utilizan un contenedor temporal de MongoDB.

Durante la ejecución puede verificarse con:

```bash
docker ps
```

Al terminar la prueba, el contenedor temporal debe eliminarse automáticamente.

---

## Cobertura mínima

La cobertura mínima está configurada en `jest.config.js`:

```js
module.exports = {
  testEnvironment: "node",
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

---

## Git

Antes de subir el proyecto se debe comprobar que no se incluyan las carpetas:

```text
node_modules/
coverage/
```

El archivo `.gitignore` contiene:

```text
node_modules/
coverage/
.env
```

---

## Comandos rápidos

Instalar dependencias:

```bash
npm install
```

Ejecutar toda la suite:

```bash
npm test
```

Ejecutar pruebas rápidas:

```bash
npm run test:unit
```

Ejecutar pruebas de integración:

```bash
npm run test:int
```

Ejecutar cobertura:

```bash
npm run test:cov
```

---

## Estado del proyecto

El proyecto queda preparado para ejecutar las pruebas automatizadas con un solo comando y puede utilizarse posteriormente dentro de un pipeline de integración continua.
