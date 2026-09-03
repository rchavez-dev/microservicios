# 1. FROM: Define la imagen base sobre la que construimos (Node 20 sobre Alpine Linux, ligera y segura)
FROM node:20-alpine

# 2. WORKDIR: Define y crea el directorio de trabajo dentro del sistema de archivos del contenedor
WORKDIR /usr/src/app

# 3. COPY: Copia los manifiestos de dependencias primero para aprovechar la cache de capas de Docker
COPY package*.json ./

# 4. RUN: Ejecuta comandos en tiempo de CONSTRUCCIÓN; instala únicamente dependencias requeridas
RUN npm install --omit=dev

# 5. COPY: Copia el resto del código fuente una vez instaladas las dependencias
COPY . .

# 6. EXPOSE: Documenta el puerto de red en el que escucha el proceso dentro del contenedor
EXPOSE 3000

# 7. CMD: Define el comando por defecto que se ejecutará en tiempo de ARRANQUE del contenedor
CMD ["npm", "start"]