const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://hrms_user:PUhUgKDGexvadvaPIlnK4DwFXZWAW66g@dpg-d7k6qnpj2pic739epstg-a.oregon-postgres.render.com/hrms_xeok',
  ssl: { rejectUnauthorized: false }
});

async function updateConstraints() {
  const commands = [
    // Attendance
    "ALTER TABLE attendance DROP CONSTRAINT IF EXISTS attendance_user_id_fkey",
    "ALTER TABLE attendance ADD CONSTRAINT attendance_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE",
    
    // Leaves
    "ALTER TABLE leaves DROP CONSTRAINT IF EXISTS leaves_user_id_fkey",
    "ALTER TABLE leaves ADD CONSTRAINT leaves_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE",
    "ALTER TABLE leaves DROP CONSTRAINT IF EXISTS leaves_approved_by_fkey",
    "ALTER TABLE leaves ADD CONSTRAINT leaves_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL",
    
    // Expenses
    "ALTER TABLE expenses DROP CONSTRAINT IF EXISTS expenses_user_id_fkey",
    "ALTER TABLE expenses ADD CONSTRAINT expenses_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE",
    "ALTER TABLE expenses DROP CONSTRAINT IF EXISTS expenses_approved_by_fkey",
    "ALTER TABLE expenses ADD CONSTRAINT expenses_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL",
    
    // Salaries
    "ALTER TABLE salaries DROP CONSTRAINT IF EXISTS salaries_user_id_fkey",
    "ALTER TABLE salaries ADD CONSTRAINT salaries_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE",
    
    // Payslips
    "ALTER TABLE payslips DROP CONSTRAINT IF EXISTS payslips_user_id_fkey",
    "ALTER TABLE payslips ADD CONSTRAINT payslips_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE",
    
    // Messages
    "ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_sender_id_fkey",
    "ALTER TABLE messages ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE",
    "ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_receiver_id_fkey",
    "ALTER TABLE messages ADD CONSTRAINT messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE",
    
    // Letters
    "ALTER TABLE letters DROP CONSTRAINT IF EXISTS letters_employee_id_fkey",
    "ALTER TABLE letters ADD CONSTRAINT letters_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE",
    "ALTER TABLE letters DROP CONSTRAINT IF EXISTS letters_generated_by_fkey",
    "ALTER TABLE letters ADD CONSTRAINT letters_generated_by_fkey FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE SET NULL",
    
    // Offboarding
    "ALTER TABLE offboarding_requests DROP CONSTRAINT IF EXISTS offboarding_requests_employee_id_fkey",
    "ALTER TABLE offboarding_requests ADD CONSTRAINT offboarding_requests_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE",
    
    // Complaints
    "ALTER TABLE complaints DROP CONSTRAINT IF EXISTS complaints_employee_id_fkey",
    "ALTER TABLE complaints ADD CONSTRAINT complaints_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE"
  ];

  console.log("Starting database constraint updates...");
  
  for (const sql of commands) {
    try {
      await pool.query(sql);
      console.log(`Executed: ${sql.substring(0, 50)}...`);
    } catch (err) {
      console.error(`FAILED: ${sql}`);
      console.error(`Error: ${err.message}`);
    }
  }

  console.log("Database update complete!");
  pool.end();
}

updateConstraints();
