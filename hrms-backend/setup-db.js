const fs = require('fs');
const { Client } = require('pg');
require('dotenv').config();

const clientConfig = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'hrms_db',
    };

const client = new Client(clientConfig);

async function run() {
  try {
    await client.connect();
    console.log('Connected to DB');

    const schemaPath = __dirname + '/schema.sql';
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await client.query(schemaSql);
      console.log('Schema applied successfully');
    }

    const seedPath = __dirname + '/seed.sql';
    if (fs.existsSync(seedPath)) {
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      await client.query(seedSql);
      console.log('Seed applied successfully');
    }
  } catch (err) {
    console.error('Error applying schema/seed:', err);
  } finally {
    await client.end();
  }
}

run();
