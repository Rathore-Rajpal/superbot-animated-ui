const mysql = require('mysql2/promise');

async function testDatabase() {
  const dbConfig = {
    host: 'sql12.freesqldatabase.com',
    user: 'sql12791893',
    password: '3ALYm8PAgb',
    database: 'sql12791893',
    port: 3306
  };

  let connection;
  try {
    // Test connection
    console.log('Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('Successfully connected to the database');

    // Test finance table
    console.log('\nTesting finance table...');
    const [financeRows] = await connection.query('SHOW COLUMNS FROM finance');
    console.log('Finance table columns:', financeRows.map((col: any) => col.Field).join(', '));
    
    const [financeCount] = await connection.query('SELECT COUNT(*) as count FROM finance');
    console.log(`Finance table has ${financeCount[0].count} records`);

    // Test task table for comparison
    console.log('\nTesting task table...');
    const [taskRows] = await connection.query('SHOW COLUMNS FROM task');
    console.log('Task table columns:', taskRows.map((col: any) => col.Field).join(', '));
    
    const [taskCount] = await connection.query('SELECT COUNT(*) as count FROM task');
    console.log(`Task table has ${taskCount[0].count} records`);

  } catch (error) {
    console.error('Database test failed:', {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage,
      sql: error.sql
    });
  } finally {
    if (connection) await connection.end();
    console.log('\nDatabase connection closed');
  }
}

testDatabase();
