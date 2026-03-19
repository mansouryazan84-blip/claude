const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const connection = await mysql.createConnection({
    host: '193.203.184.199',
    port: 3306,
    user: 'u998106817_WHS',
    password: 'Optimum2026@',
    database: 'u998106817_WHS'
  });

  try {
    console.log('Connected to database, reading migration file...');
    const migrationSQL = fs.readFileSync(path.join(__dirname, 'migration.sql'), 'utf8');
    
    console.log('Executing migration...');
    await connection.execute(migrationSQL);
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await connection.end();
  }
}

runMigration();
