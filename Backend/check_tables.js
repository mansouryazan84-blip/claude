const mysql = require('mysql2/promise');

async function checkTables() {
  const connection = await mysql.createConnection({
    host: '193.203.184.199',
    port: 3306,
    user: 'u998106817_WHS',
    password: 'Optimum2026@',
    database: 'u998106817_WHS'
  });

  try {
    console.log('Checking existing tables...');
    const [tables] = await connection.execute("SHOW TABLES");
    console.log('Tables found:', tables.length);
    tables.forEach(table => console.log(' -', Object.values(table)[0]));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

checkTables();
