FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY src ./src
COPY proto ./proto

EXPOSE 4000

CMD ["node", "src/server.js"]
