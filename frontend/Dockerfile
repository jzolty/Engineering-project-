# --- Build stage ---
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# --- Run stage (NGINX) ---
FROM nginx:alpine

# usuń domyślną zawartość nginx
RUN rm -rf /usr/share/nginx/html/*

# skopiuj statyczną aplikację React do katalogu nginx
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
