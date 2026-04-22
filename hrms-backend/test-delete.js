const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://hrms_user:PUhUgKDGexvadvaPIlnK4DwFXZWAW66g@dpg-d7k6qnpj2pic739epstg-a.oregon-postgres.render.com/hrms_xeok',
  ssl: { rejectUnauthorized: false }
});
async function test() {
  try {
    const result = await pool.query("SELECT id FROM users WHERE email='akash@gmail.com'");
    if(result.rows.length === 0) return console.log('not found');
    const id = result.rows[0].id;
    await pool.query("DELETE FROM users WHERE id=$1", [id]);
    console.log('deleted successfully');
  } catch(e) {
    console.error("ERROR DELETING:", e.message);
  } finally {
    pool.end();
  }
}
test();
