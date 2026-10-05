# Guía y Definición del Proyecto: KANBAN-API

Documento de referencia para el equipo de desarrollo (Persona 1, Persona 2 y Persona 3) y agentes de IA.

---

## 1. Stack Tecnológico

- **Runtime**: Node.js
- **Framework Web**: Express 4.x
- **ODM / Base de Datos**: Mongoose 8.x / MongoDB
- **Variables de Entorno**: Dotenv
- **Middlewares Auxiliares**: CORS, Morgan (logger HTTP)
- **Desarrollo**: Nodemon

---

## 2. Estructura del Proyecto

```text
KANBAN-API/
├── src/
│   ├── config/
│   │   └── db.js            # Conexión a MongoDB con Mongoose
│   ├── controllers/         # Lógica de negocio y controladores de rutas
│   │   ├── boardController.js
│   │   ├── columnController.js
│   │   └── ticketController.js
│   ├── middlewares/         # Validaciones, chequeo de ObjectId, pertenencia, errores
│   ├── models/              # Modelos y schemas de Mongoose con hooks de cascada
│   │   ├── Board.js
│   │   ├── Column.js
│   │   └── Ticket.js
│   ├── routes/              # Definición de endpoints Express
│   │   ├── boardRoutes.js
│   │   ├── columnRoutes.js
│   │   └── ticketRoutes.js
│   ├── app.js               # Instancia de Express y configuración de middlewares globales
│   └── server.js            # Punto de entrada del servidor (listen + conexión a DB)
├── .env.example
├── .gitignore
├── AGENTS.md
└── package.json
```

---

## 3. Contrato de Datos y Modelos

### 3.1. Modelo `Board`
- `name` (String, requerido, trim): Nombre del tablero.
- `description` (String, opcional, trim, default: `""`): Descripción del tablero.
- `timestamps`: `createdAt`, `updatedAt`.
- **Cascada**: Al borrar un tablero se eliminan automáticamente todas sus columnas y tickets asociados.

### 3.2. Modelo `Column`
- `name` (String, requerido, trim): Nombre de la columna (ej. "To Do", "In Progress", "Done").
- `board` (ObjectId ref `Board`, requerido): Tablero al que pertenece la columna.
- `position` (Number, default: `0`): Posición u orden dentro del tablero.
- `timestamps`: `createdAt`, `updatedAt`.
- **Cascada**: Al borrar una columna se eliminan automáticamente todos sus tickets asociados.

### 3.3. Modelo `Ticket`
- `title` (String, requerido, trim): Título o resumen de la tarea.
- `description` (String, opcional, trim, default: `""`): Descripción detallada del ticket.
- `column` (ObjectId ref `Column`, requerido): Columna a la que pertenece el ticket.
- `board` (ObjectId ref `Board`, requerido): Tablero al que pertenece el ticket (facilita validaciones y eliminación directa).
- `position` (Number, default: `0`): Posición u orden dentro de la columna.
- `timestamps`: `createdAt`, `updatedAt`.

---

## 4. Reglas Críticas y Límites Negativos (IMPORTANTE)

1. **Borrado en Cascada**:
   - **NUNCA** usar `findByIdAndDelete(id)` ni `Model.deleteOne({ _id })` para borrar tableros o columnas.
   - Para que los hooks de cascada de Mongoose se ejecuten (`document middleware`), primero se debe buscar el documento y luego invocar su método:
     ```javascript
     const doc = await Model.findById(id);
     if (!doc) return res.status(404).json({ error: 'Recurso no encontrado' });
     await doc.deleteOne(); // <-- Dispara pre('deleteOne', { document: true, query: false })
     ```
2. **Separación de responsabilidades**:
   - Los archivos en `routes/` solo deben definir rutas y asignar middlewares y controladores.
   - La lógica de negocio y consultas va en `controllers/`.
   - Las validaciones reutilizables (existencia de IDs, pertenencia de columna/ticket al tablero) van en `middlewares/`.
3. **Consistencia de Relaciones**:
   - Al crear un ticket, verificar que la columna pertenezca efectivamente al tablero especificado.
   - Al mover un ticket a otra columna, verificar que la nueva columna pertenezca al mismo tablero.
4. **Seguridad y Entorno**:
   - Nunca comitear `.env` ni claves privadas al repositorio.

---

## 5. Tabla de Endpoints REST

| Método | Endpoint | Descripción | Body / Parámetros | Respuestas |
|---|---|---|---|---|
| **GET** | `/api/health` | Chequeo de salud del servicio | Ninguno | `200 OK` |
| **POST** | `/api/boards` | Crear un tablero | `{ "name": "...", "description": "..." }` | `201 Created`, `400 Bad Request` |
| **GET** | `/api/boards` | Listar todos los tableros | Ninguno | `200 OK` |
| **GET** | `/api/boards/:id` | Obtener un tablero con sus detalles | Param `:id` | `200 OK`, `404 Not Found` |
| **PUT** | `/api/boards/:id` | Actualizar nombre/descripción de un tablero | `{ "name": "...", "description": "..." }` | `200 OK`, `400 / 404` |
| **DELETE** | `/api/boards/:id` | Eliminar tablero (cascada: columnas y tickets) | Param `:id` | `200 OK` o `204 No Content`, `404` |
| **POST** | `/api/boards/:boardId/columns` | Crear una columna dentro de un tablero | `{ "name": "...", "position": 0 }` | `201 Created`, `400 / 404` |
| **GET** | `/api/boards/:boardId/columns` | Obtener columnas de un tablero | Param `:boardId` | `200 OK`, `404 Not Found` |
| **PUT** | `/api/columns/:id` | Actualizar columna (nombre o posición) | `{ "name": "...", "position": 1 }` | `200 OK`, `400 / 404` |
| **DELETE** | `/api/columns/:id` | Eliminar columna (cascada: tickets asociados) | Param `:id` | `200 OK` o `204 No Content`, `404` |
| **POST** | `/api/columns/:columnId/tickets` | Crear un ticket en una columna | `{ "title": "...", "description": "...", "board": "...", "position": 0 }` | `201 Created`, `400 / 404` |
| **GET** | `/api/columns/:columnId/tickets` | Listar tickets de una columna | Param `:columnId` | `200 OK`, `404 Not Found` |
| **GET** | `/api/tickets/:id` | Obtener detalle de un ticket | Param `:id` | `200 OK`, `404 Not Found` |
| **PUT** | `/api/tickets/:id` | Actualizar ticket (título, descripción, posición) | `{ "title": "...", "description": "..." }` | `200 OK`, `400 / 404` |
| **PATCH** | `/api/tickets/:id/move` | Mover ticket de columna y/o posición | `{ "targetColumnId": "...", "position": 2 }` | `200 OK`, `400 / 404` |
| **DELETE** | `/api/tickets/:id` | Eliminar un ticket | Param `:id` | `200 OK` o `204 No Content`, `404` |

---

## 6. División de Tareas

- **Persona 1**: Configuración inicial, conexión a DB, modelos Mongoose con hooks de cascada (`Board`, `Column`, `Ticket`), verificación de cascada.
- **Persona 2**: Middlewares de validación (`validateObjectId`, validación de pertenencia), controladores y rutas para Boards, Columns y Tickets.
- **Persona 3**: Colección de pruebas de integración (Postman / Bruno / Thunder Client), casos positivos, casos borde (404, validaciones) y verificación de eliminación en cascada.
