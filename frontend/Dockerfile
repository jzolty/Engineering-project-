# --- Build stage ---
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# odbieramy zmienne z Azure
ARG REACT_APP_API_URL
ARG REACT_APP_GOOGLE_AUTH_URL

ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_GOOGLE_AUTH_URL=$REACT_APP_GOOGLE_AUTH_URL

RUN npm run build

# --- Static server stage ---
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
