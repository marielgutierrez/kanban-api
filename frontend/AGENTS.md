# Guía para Agentes de IA - Kanban Frontend

## 1. Stack Tecnológico

- **Framework UI**: React 19
- **Build Tool**: Vite
- **Router**: React Router DOM
- **HTTP Client**: Axios
- **Estilos**: CSS con variables (tema claro/oscuro)

## 2. Estructura del Proyecto

```text
kanban-frontend/
├── src/
│   ├── api/                  # Capa de servicios API
│   │   ├── client.js         # Cliente Axios centralizado
│   │   ├── boardService.js   # Servicios de tableros
│   │   ├── columnService.js  # Servicios de columnas
│   │   ├── ticketService.js  # Servicios de tickets
│   │   └── mockData.js       # Datos de prueba
│   ├── components/           # Componentes presentacionales (Integrante 2)
│   ├── pages/                # Páginas/contenedores (Integrante 3)
│   ├── routes/               # Configuración de rutas (Integrante 3)
│   ├── hooks/                # Custom hooks (Integrante 3)
│   ├── styles/               # Estilos globales y tema
│   ├── App.jsx               # Componente raíz
│   └── main.jsx              # Punto de entrada
├── .env.example              # Variables de entorno de ejemplo
├── .env.local                # Variables locales (no commitear)
├── FRONTEND_SPEC.md          # Especificación funcional
└── package.json
```

## 3. Reglas Obligatorias

### Arquitectura
1. **Separar responsabilidades**: llamadas HTTP, lógica de páginas y componentes visuales van en archivos distintos
2. **No poner fetch/Axios dentro de componentes presentacionales** (TicketCard, ColumnCard, etc.)
3. **Los servicios no muestran alertas visuales**: comunican el error y la página decide cómo mostrarlo
4. **No inventar endpoints**: usar solo los documentados en FRONTEND_SPEC.md

### Variables de Entorno
5. **Usar `import.meta.env.VITE_API_URL`** para la URL base de la API
6. **Nunca incluir secretos** en variables `VITE_*` (son visibles en el navegador)

### Estilos
7. **No escribir colores hexadecimales directamente** en componentes
8. **Usar variables CSS**: `var(--text-primary)`, `var(--bg-primary)`, etc.
9. **Tokens de tema**: `--bg-primary`, `--surface-primary`, `--text-primary`, `--accent-color`, `--border-color`

### UX
10. **Respetar estados de carga**: deshabilitar botones y mostrar spinner durante POST/PATCH/DELETE
11. **Manejar errores**: mostrar mensajes accesibles del servidor
12. **Validar formularios** en el cliente antes de enviar
13. **Accesibilidad básica**: labels, aria-labels, navegación por teclado

## 4. Flujo de Trabajo

1. **Leer FRONTEND_SPEC.md** antes de modificar código
2. **Definir props** de componentes antes de implementar
3. **Probar con mocks** antes de conectar al backend real
4. **Verificar ambos temas** (claro/oscuro) al agregar estilos

## 5. Comandos Útiles

```bash
npm run dev      # Iniciar servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Preview del build
```

## 6. Comunicación del Equipo

- **Integrante 1** (API): define cómo se habla con la API
- **Integrante 2** (UI): define cómo se ven y qué props reciben los componentes
- **Integrante 3** (Páginas): conecta ambas partes

**Nadie cambia el contrato acordado por su cuenta.**
