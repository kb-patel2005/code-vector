# frontend
FROM node:22-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Backend
FROM node:22-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ .

# frontend build into backend
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

EXPOSE 5000
CMD ["node", "backend/server.js"]