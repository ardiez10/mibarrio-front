FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/mibarrio-front/browser /usr/share/nginx/html
COPY env.template.js /usr/share/nginx/html/env.template.js
COPY docker-entrypoint.sh /docker-entrypoint.d/99-mibarrio-env.sh

RUN chmod +x /docker-entrypoint.d/99-mibarrio-env.sh

EXPOSE 80
