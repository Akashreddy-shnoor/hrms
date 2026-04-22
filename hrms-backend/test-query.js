const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://hrms_user:PUhUgKDGexvadvaPIlnK4DwFXZWAW66g@dpg-d7k6qnpj2pic739epstg-a.oregon-postgres.render.com/hrms_xeok',
  ssl: { rejectUnauthorized: false }
});

async function testQuery() {
  const company_id = 1;
  const user_id = 4;
  try {
    const result = await pool.query(
      `SELECT u.id AS user_id, u.first_name, u.last_name, u.email, u.role, u.department, u.designation,
              lm.message AS last_message,
              lm.file_name AS last_file_name,
              lm.file_type AS last_file_type,
              lm.created_at AS last_message_at,
              lm.sender_id AS last_sender_id,
              COALESCE(uc.unread_count, 0) AS unread_count
       FROM users u
       LEFT JOIN LATERAL (
         SELECT m.message, m.file_name, m.file_type, m.created_at, m.sender_id
         FROM messages m
         WHERE m.company_id = $1
           AND m.conversation_key = CASE
             WHEN u.id < $2 THEN CONCAT(u.id, ':', $2)
             ELSE CONCAT($2, ':', u.id)
           END
         ORDER BY m.created_at DESC, m.id DESC
         LIMIT 1
       ) lm ON true
       LEFT JOIN LATERAL (
         SELECT COUNT(*)::int AS unread_count
         FROM messages m
         WHERE m.company_id = $1
           AND m.sender_id = u.id
           AND m.receiver_id = $2
           AND m.seen_status = false
       ) uc ON true
       WHERE u.company_id = $1 AND u.role = 'employee'
       ORDER BY COALESCE(lm.created_at, u.created_at) DESC, u.first_name ASC, u.last_name ASC`,
      [company_id, user_id]
    )
    console.log("Query Results:", result.rows);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
testQuery();
