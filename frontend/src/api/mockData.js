export const mockBoards = [
  {
    _id: '6500a1b2c3d4e5f6a7b8c9d1',
    name: 'Proyecto Kanban',
    description: 'Tablero principal del equipo de desarrollo',
    createdAt: '2026-10-01T10:00:00.000Z',
    updatedAt: '2026-10-15T12:00:00.000Z',
  },
  {
    _id: '6500a1b2c3d4e5f6a7b8c9d2',
    name: 'Personal',
    description: 'Tareas personales y pendientes',
    createdAt: '2026-10-05T08:00:00.000Z',
    updatedAt: '2026-10-10T09:00:00.000Z',
  },
];

export const mockBoardDetail = {
  _id: '6500a1b2c3d4e5f6a7b8c9d1',
  name: 'Proyecto Kanban',
  description: 'Tablero principal del equipo de desarrollo',
  createdAt: '2026-10-01T10:00:00.000Z',
  updatedAt: '2026-10-15T12:00:00.000Z',
  columns: [
    {
      _id: '6500a1b2c3d4e5f6a7b8c9e1',
      name: 'Por hacer',
      board: '6500a1b2c3d4e5f6a7b8c9d1',
      position: 0,
      createdAt: '2026-10-01T10:00:00.000Z',
      updatedAt: '2026-10-01T10:00:00.000Z',
    },
    {
      _id: '6500a1b2c3d4e5f6a7b8c9e2',
      name: 'En progreso',
      board: '6500a1b2c3d4e5f6a7b8c9d1',
      position: 1,
      createdAt: '2026-10-01T10:00:00.000Z',
      updatedAt: '2026-10-01T10:00:00.000Z',
    },
    {
      _id: '6500a1b2c3d4e5f6a7b8c9e3',
      name: 'Hecho',
      board: '6500a1b2c3d4e5f6a7b8c9d1',
      position: 2,
      createdAt: '2026-10-01T10:00:00.000Z',
      updatedAt: '2026-10-01T10:00:00.000Z',
    },
  ],
};

export const mockTickets = {
  '6500a1b2c3d4e5f6a7b8c9e1': [
    {
      _id: '6500a1b2c3d4e5f6a7b8c9f1',
      title: 'Diseñar interfaz de login',
      description: 'Crear el componente de login con validación',
      column: '6500a1b2c3d4e5f6a7b8c9e1',
      board: '6500a1b2c3d4e5f6a7b8c9d1',
      position: 0,
      createdAt: '2026-10-02T10:00:00.000Z',
      updatedAt: '2026-10-02T10:00:00.000Z',
    },
    {
      _id: '6500a1b2c3d4e5f6a7b8c9f2',
      title: 'Configurar rutas',
      description: 'Definir rutas protegidas y públicas',
      column: '6500a1b2c3d4e5f6a7b8c9e1',
      board: '6500a1b2c3d4e5f6a7b8c9d1',
      position: 1,
      createdAt: '2026-10-02T11:00:00.000Z',
      updatedAt: '2026-10-02T11:00:00.000Z',
    },
  ],
  '6500a1b2c3d4e5f6a7b8c9e2': [
    {
      _id: '6500a1b2c3d4e5f6a7b8c9f3',
      title: 'Crear cliente API',
      description: 'Configurar Axios con interceptores',
      column: '6500a1b2c3d4e5f6a7b8c9e2',
      board: '6500a1b2c3d4e5f6a7b8c9d1',
      position: 0,
      createdAt: '2026-10-03T10:00:00.000Z',
      updatedAt: '2026-10-03T10:00:00.000Z',
    },
  ],
  '6500a1b2c3d4e5f6a7b8c9e3': [
    {
      _id: '6500a1b2c3d4e5f6a7b8c9f4',
      title: 'Definir endpoints',
      description: 'Documentar todos los endpoints de la API',
      column: '6500a1b2c3d4e5f6a7b8c9e3',
      board: '6500a1b2c3d4e5f6a7b8c9d1',
      position: 0,
      createdAt: '2026-10-01T15:00:00.000Z',
      updatedAt: '2026-10-01T15:00:00.000Z',
    },
  ],
};

export const mockNewBoard = {
  _id: '6500a1b2c3d4e5f6a7b8c9d3',
  name: 'Nuevo Tablero',
  description: 'Descripción de prueba',
  createdAt: '2026-10-19T10:00:00.000Z',
  updatedAt: '2026-10-19T10:00:00.000Z',
};

export const mockNewColumn = {
  _id: '6500a1b2c3d4e5f6a7b8c9e4',
  name: 'Nueva columna',
  board: '6500a1b2c3d4e5f6a7b8c9d1',
  position: 3,
  createdAt: '2026-10-19T10:00:00.000Z',
  updatedAt: '2026-10-19T10:00:00.000Z',
};

export const mockNewTicket = {
  _id: '6500a1b2c3d4e5f6a7b8c9f5',
  title: 'Nuevo ticket',
  description: 'Descripción del nuevo ticket',
  column: '6500a1b2c3d4e5f6a7b8c9e1',
  board: '6500a1b2c3d4e5f6a7b8c9d1',
  position: 2,
  createdAt: '2026-10-19T10:00:00.000Z',
  updatedAt: '2026-10-19T10:00:00.000Z',
};
