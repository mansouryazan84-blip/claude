const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const connection = await mysql.createConnection({
    host: '193.203.184.199',
    port: 3306,
    user: 'u998106817_WHS',
    password: 'Optimum2026@',
    database: 'u998106817_WHS',
    multipleStatements: true
  });

  try {
    console.log('Connected to database, reading migration file...');
    const migrationSQL = fs.readFileSync(path.join(__dirname, 'migration.sql'), 'utf8');
    
    // Split SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt && !stmt.startsWith('--'));
    
    console.log(`Executing ${statements.length} SQL statements...`);
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await connection.execute(statement + ';');
          console.log('✓ Executed statement successfully');
        } catch (err) {
          console.error('✗ Error in statement:', err.message);
          console.log('Statement:', statement.substring(0, 100) + '...');
        }
      }
    }
    
    console.log('Migration completed!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await connection.end();
  }
}

runMigration();
