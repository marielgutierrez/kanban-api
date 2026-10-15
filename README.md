# Kanban API

API REST desarrollada con **Node.js, Express y MongoDB** para gestionar tableros Kanban, columnas y tickets. El proyecto implementa el backend siguiendo buenas prácticas REST y separación de responsabilidades.

## Tecnologías

- Node.js y Express
- MongoDB y Mongoose
- dotenv, CORS y Morgan

## Funcionalidades

- Creación y consulta de tableros.
- Creación y eliminación de columnas.
- Gestión de tickets asociados a columnas.
- Validación de recursos y manejo de errores HTTP.
- Organización mediante modelos, controladores, rutas y middlewares.
- Especificaciones de desarrollo centralizadas en `AGENTS.md`.

## Instalación

```bash
git clone https://github.com/marielgutierrez/kanban-api.git
cd kanban-api
npm install
```

Crear un archivo `.env` con la configuración de MongoDB:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/kanban
```

Iniciar el servidor con `npm run dev` o `npm start`, según los scripts configurados en `package.json`.

## Endpoints principales

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/boards` | Crear un tablero |
| GET | `/api/boards/:boardId` | Obtener un tablero |
| POST | `/api/boards/:boardId/columns` | Crear una columna |
| DELETE | `/api/boards/:boardId/columns/:columnId` | Eliminar una columna |

## Desarrollo basado en especificaciones (SDD)

El archivo `AGENTS.md` centraliza las reglas técnicas, las convenciones y los requisitos del proyecto para orientar el desarrollo y mantener la consistencia del código.

## Alcance

Proyecto académico correspondiente al desarrollo del **backend** de una aplicación Kanban.
