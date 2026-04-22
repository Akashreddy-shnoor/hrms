const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://hrms_user:PUhUgKDGexvadvaPIlnK4DwFXZWAW66g@dpg-d7k6qnpj2pic739epstg-a.oregon-postgres.render.com/hrms_xeok',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    const res = await pool.query(`
      SELECT
          conname AS constraint_name,
          relname AS table_name,
          attname AS column_name
      FROM pg_constraint con
      JOIN pg_class rel ON rel.oid = con.conrelid
      JOIN pg_attribute att ON att.attrelid = rel.oid AND att.attnum = ANY(con.key)
      WHERE contype = 'f' 
        AND confrelid = 'users'::regclass;
    `);
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
run();
