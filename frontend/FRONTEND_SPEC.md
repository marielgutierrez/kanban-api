# Especificación Funcional - Kanban Frontend

## 1. Matriz de Rutas

| Ruta | Componente | Acceso | Comportamiento |
|---|---|---|---|
| `/login` | LoginPage | Público | Muestra formulario de acceso |
| `/boards` | BoardsListPage | Protegido | Lista los tableros disponibles |
| `/boards/:boardId` | BoardDetailPage | Protegido | Carga tablero, columnas y tickets |

## 2. Contrato de la API

### Endpoints disponibles

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Chequeo de salud |
| GET | `/api/boards` | Listar tableros |
| POST | `/api/boards` | Crear tablero |
| GET | `/api/boards/:boardId` | Obtener tablero con columnas |
| POST | `/api/boards/:boardId/columns` | Crear columna |
| DELETE | `/api/boards/:boardId/columns/:columnId` | Eliminar columna |
| GET | `/api/boards/:boardId/columns/:columnId/tickets` | Listar tickets de columna |
| POST | `/api/boards/:boardId/columns/:columnId/tickets` | Crear ticket |
| PATCH | `/api/boards/:boardId/columns/:columnId/tickets/:ticketId` | Actualizar/mover ticket |

### Formato de error

Todos los errores devuelven:

```json
{
  "error": "mensaje descriptivo"
}
```

### Modelos de datos

**Board:**
```json
{
  "_id": "string",
  "name": "string",
  "description": "string",
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

**Column:**
```json
{
  "_id": "string",
  "name": "string",
  "board": "boardId",
  "position": 0,
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

**Ticket:**
```json
{
  "_id": "string",
  "title": "string",
  "description": "string",
  "column": "columnId",
  "board": "boardId",
  "position": 0,
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

## 3. Validaciones de Formularios

### Crear/Editar Tablero
- `name`: requerido, mínimo 1 carácter
- `description`: opcional

### Crear Columna
- `name`: requerido, mínimo 1 carácter

### Crear/Editar Ticket
- `title`: requerido, mínimo 1 carácter
- `description`: opcional

### Manejo de errores del servidor
- Si el servidor devuelve un error asociado a un campo, mostrarlo junto al input
- Para errores generales, mostrar Toast o mensaje accesible

## 4. Estados de la Aplicación

- **Loading**: mostrar indicador de carga mientras se obtienen datos
- **Empty**: mostrar mensaje cuando no hay tableros/columnas/tickets
- **Error**: mostrar mensaje de error con opción de reintentar
- **Success**: mostrar datos o confirmación

## 5. Movimiento Optimista de Tickets

1. Guardar estado anterior del tablero en memoria
2. Mover visualmente el ticket a la columna destino inmediatamente
3. Enviar PATCH al backend
4. Si responde OK: conservar nuevo estado
5. Si falla: restaurar estado anterior y mostrar Toast de error

## 6. Tema Claro/Oscuro

- Usar variables CSS (`--bg-primary`, `--surface-primary`, `--text-primary`, `--accent-color`, `--border-color`)
- Detectar preferencia del sistema con `prefers-color-scheme`
- Persistir elección manual en `localStorage`
- Clase `dark` en elemento `html`

## 7. Criterios de Aceptación

- [ ] La aplicación arranca sin errores
- [ ] Las rutas funcionan correctamente
- [ ] La lista de tableros se carga desde la API
- [ ] La vista de tablero muestra columnas y tickets
- [ ] Se puede crear, editar, mover y eliminar tickets
- [ ] Título vacío se bloquea en cliente y servidor
- [ ] Botones se deshabilitan durante mutaciones
- [ ] Movimiento optimista revierte si falla
- [ ] Tema claro/oscuro funciona y persiste
- [ ] Frontend publicado se comunica con backend publicado
