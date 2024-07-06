# Etapa 1: Dependencias de desarrollo
FROM node:20.14.0 AS dev-deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

# Etapa 2: Construcción
FROM node:20.14.0 AS builder

WORKDIR /app
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Etapa 3: Producción
FROM nginx:1.23.3 AS prod
EXPOSE 80

COPY --from=builder /app/dist/carnescdp /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
