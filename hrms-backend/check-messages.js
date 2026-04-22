const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://hrms_user:PUhUgKDGexvadvaPIlnK4DwFXZWAW66g@dpg-d7k6qnpj2pic739epstg-a.oregon-postgres.render.com/hrms_xeok',
  ssl: { rejectUnauthorized: false }
});

async function checkMessages() {
  try {
    const result = await pool.query("SELECT * FROM messages LIMIT 5");
    console.log("Total messages found:", (await pool.query("SELECT COUNT(*) FROM messages")).rows[0].count);
    console.log("Sample messages:", result.rows);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
checkMessages();
