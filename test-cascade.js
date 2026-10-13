require('dotenv').config();
const mongoose = require('mongoose');
const Board = require('./src/models/Board');
const Column = require('./src/models/Column');
const Ticket = require('./src/models/Ticket');

async function testCascade() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kanban';
    console.log(`Conectando a MongoDB en: ${mongoUri}...`);
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 4000
    });
    console.log('✅ Conexión establecida con MongoDB.\n');

    // 1. Limpieza inicial
    console.log('1. Limpiando datos de prueba...');
    await Board.deleteMany({ name: /^Test Tablero/ });
    await Column.deleteMany({ name: /^Test Col/ });
    await Ticket.deleteMany({ title: /^Test Ticket/ });

    // 2. Crear Tablero
    console.log('2. Creando Tablero...');
    const board = await Board.create({
      name: 'Test Tablero Principal',
      description: 'Tablero para verificar borrado en cascada'
    });
    console.log(`   -> Tablero creado [ID: ${board._id}]`);

    // 3. Crear Columnas
    console.log('3. Creando Columnas...');
    const col1 = await Column.create({ name: 'Test Col 1', board: board._id, position: 0 });
    const col2 = await Column.create({ name: 'Test Col 2', board: board._id, position: 1 });
    console.log(`   -> Columnas creadas [Col1: ${col1._id}, Col2: ${col2._id}]`);

    // 4. Crear Tickets
    console.log('4. Creando Tickets...');
    const ticket1 = await Ticket.create({ title: 'Test Ticket 1', board: board._id, column: col1._id });
    const ticket2 = await Ticket.create({ title: 'Test Ticket 2', board: board._id, column: col1._id });
    const ticket3 = await Ticket.create({ title: 'Test Ticket 3', board: board._id, column: col2._id });
    console.log(`   -> Tickets creados [T1: ${ticket1._id}, T2: ${ticket2._id}, T3: ${ticket3._id}]`);

    // 5. Test cascada en Columna (Borrar col2 debe eliminar ticket3)
    console.log('\n--- PRUEBA 1: Cascada Columna -> Tickets ---');
    console.log('Borrando Columna 2 usando col2.deleteOne()...');
    await col2.deleteOne();

    const ticketsInCol2 = await Ticket.find({ column: col2._id });
    console.log(`Tickets restantes en Columna 2: ${ticketsInCol2.length} (esperado: 0)`);
    if (ticketsInCol2.length !== 0) {
      throw new Error('FALLÓ la cascada de Columna: aún existen tickets asociados');
    }
    console.log('✅ Cascada de Columna verificada con éxito.');

    // 6. Test cascada en Tablero (Borrar board debe eliminar col1 y tickets restantes: ticket1, ticket2)
    console.log('\n--- PRUEBA 2: Cascada Tablero -> Columnas y Tickets ---');
    console.log('Borrando Tablero usando board.deleteOne()...');
    await board.deleteOne();

    const colsRemaining = await Column.find({ board: board._id });
    const ticketsRemaining = await Ticket.find({ board: board._id });
    console.log(`Columnas restantes del tablero: ${colsRemaining.length} (esperado: 0)`);
    console.log(`Tickets restantes del tablero: ${ticketsRemaining.length} (esperado: 0)`);

    if (colsRemaining.length !== 0 || ticketsRemaining.length !== 0) {
      throw new Error('FALLÓ la cascada de Tablero: aún existen columnas o tickets asociados');
    }
    console.log('✅ Cascada de Tablero verificada con éxito (todo fue eliminado automáticamente).');

    console.log('\n🎉 ¡TODAS LAS PRUEBAS DE CASCADA PASARON CORRECTAMENTE!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error durante la ejecución:', error.message);
    if (
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('buffering timed out') ||
      error.name === 'MongooseServerSelectionError'
    ) {
      console.log('\n⚠️ Nota: No hay una instancia de MongoDB activa en localhost:27017.');
      console.log('Asegurate de iniciar tu servicio de MongoDB o configurar MONGODB_URI en .env y luego ejecutar:');
      console.log('node test-cascade.js\n');
    }
    process.exit(1);
  }
}

testCascade();
