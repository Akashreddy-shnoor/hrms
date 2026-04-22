const { Client } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function fixAdmin() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'hrms_db',
  });

  try {
    await client.connect();
    const hash = await bcrypt.hash('admin123', 10);
    await client.query('UPDATE users SET password_hash=$1 WHERE email=$2', [hash, 'admin@shnoor.com']);
    console.log('Admin password fixed to admin123');
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

fixAdmin();
