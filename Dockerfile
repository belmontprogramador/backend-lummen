FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Porta do backend
EXPOSE 3333

# Rodar migrations automaticamente quando subir o container
CMD ["sh", "-c", "npx prisma migrate deploy && node src/server.js"]
