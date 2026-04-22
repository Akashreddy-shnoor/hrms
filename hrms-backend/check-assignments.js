const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://hrms_user:PUhUgKDGexvadvaPIlnK4DwFXZWAW66g@dpg-d7k6qnpj2pic739epstg-a.oregon-postgres.render.com/hrms_xeok',
  ssl: { rejectUnauthorized: false }
});

async function check() {
  try {
    const managers = await pool.query("SELECT id, first_name, company_id, role FROM users WHERE role='manager'");
    console.log("Managers:", managers.rows);
    const employees = await pool.query("SELECT id, first_name, company_id, role FROM users WHERE role='employee'");
    console.log("Employees:", employees.rows);
    const companies = await pool.query("SELECT id, name FROM companies");
    console.log("Companies:", companies.rows);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
check();
