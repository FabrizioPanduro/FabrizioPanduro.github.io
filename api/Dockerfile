# ==========================================
# Etapa 1: Construcción (Builder)
# ==========================================
# Usamos una imagen base pequeña con un tag fijo (Regla base)
FROM node:20-alpine AS builder

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos solo los archivos de dependencias primero para aprovechar la caché de Docker
COPY package*.json ./

# Instalamos solo las dependencias de producción
RUN npm ci --omit=dev

# ==========================================
# Etapa 2: Producción (Runner) - RETO 1 (Imagen Mínima)
# ==========================================
FROM node:20-alpine

WORKDIR /app

# Copiamos solo los módulos instalados y el código desde la etapa "builder"
# Esto desecha compiladores y herramientas de npm, reduciendo el peso final a la mitad
COPY --from=builder /app/node_modules ./node_modules
COPY package.json app.js ./

# RETO 3 (Nadie es root): Cambiamos al usuario "node" que ya viene incluido en las imágenes alpine
USER node

# Exponemos el puerto estándar donde suele correr la API de Node (3000)
EXPOSE 3000

# Comando para arrancar la API
CMD ["node", "app.js"]