# Etapa 1: Build Angular
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci  # ou npm install (use --legacy-peer-deps se peer deps conflitar)
COPY . .
RUN npm run build -- --configuration production

# Etapa 2: Nginx (remove PADRÃO e copia custom)
FROM nginx:alpine AS runtime

# 🔥 CRÍTICO: Remove TUDO do Nginx padrão (inclui welcome e 50x.html)
RUN rm -rf /usr/share/nginx/html/*

# Copia config custom (substitui default.conf)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia o build (confirme path com ng build --prod localmente)
COPY --from=build /app/dist/my-character-client/browser /usr/share/nginx/html

# Gzip + cache (opcional, mas recomendado)
RUN sed -i 's/#gzip/gzip/' /etc/nginx/nginx.conf && \
    sed -i 's/#gzip_types/gzip_types/' /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]