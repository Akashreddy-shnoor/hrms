const pool = require('../../config/db')
const bcrypt = require('bcryptjs')

// ── SUBSCRIPTIONS ─────────────────────────────────────────

const getSubscriptions = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM subscriptions ORDER BY id')
    res.json({ success: true, data: result.rows })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

const createSubscription = async (req, res) => {
  try {
    const { name, monthly_price, annual_price, max_users } = req.body
    const result = await pool.query(
      `INSERT INTO subscriptions (name, monthly_price, annual_price, max_users)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, monthly_price, annual_price, max_users]
    )
    res.status(201).json({ success: true, data: result.rows[0] })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

const updateSubscription = async (req, res) => {
  try {
    const { id } = req.params
    const { name, monthly_price, annual_price, max_users } = req.body
    const result = await pool.query(
      `UPDATE subscriptions SET name=$1, monthly_price=$2, annual_price=$3, max_users=$4
       WHERE id=$5 RETURNING *`,
      [name, monthly_price, annual_price, max_users, id]
    )
    res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

const deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM subscriptions WHERE id=$1', [id])
    res.json({ success: true, message: 'Subscription deleted' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ── TRANSACTIONS ──────────────────────────────────────────

const getTransactions = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.*, c.name as company_name 
      FROM transactions t
      LEFT JOIN companies c ON t.company_id = c.id
      ORDER BY t.created_at DESC
    `)
    res.json({ success: true, data: result.rows })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ── ADMIN MANAGEMENT ──────────────────────────────────────

const getAdmins = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, first_name, last_name, email, phone, created_at 
       FROM users WHERE role='superadmin' ORDER BY created_at`
    )
    res.json({ success: true, data: result.rows })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

const getManagers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.id, u.first_name, u.last_name, u.email, u.phone, u.created_at,
             u.designation, u.department,
             c.name as company_name
      FROM users u
      LEFT JOIN companies c ON u.company_id = c.id
      WHERE u.role='manager' ORDER BY u.created_at
    `)
    res.json({ success: true, data: result.rows })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

const createAdmin = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, password } = req.body
    const password_hash = await bcrypt.hash(password, 10)
    const result = await pool.query(
      `INSERT INTO users (first_name, last_name, email, phone, password_hash, role)
       VALUES ($1,$2,$3,$4,$5,'superadmin') RETURNING id, first_name, last_name, email`,
      [first_name, last_name, email, phone, password_hash]
    )
    res.status(201).json({ success: true, data: result.rows[0] })
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ success: false, message: 'Email already exists' })
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

const createManager = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, password, company_id, designation, department } = req.body
    const password_hash = await bcrypt.hash(password, 10)
    const result = await pool.query(
      `INSERT INTO users (first_name, last_name, email, phone, password_hash, role, company_id, designation, department)
       VALUES ($1,$2,$3,$4,$5,'manager',$6,$7,$8) RETURNING id, first_name, last_name, email`,
      [first_name, last_name, email, phone, password_hash, company_id, designation, department]
    )
    res.status(201).json({ success: true, data: result.rows[0] })
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ success: false, message: 'Email already exists' })
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM users WHERE id=$1', [id])
    res.json({ success: true, message: 'User removed' })
  } catch (err) {
    console.error('deleteUser error:', err)
    res.status(500).json({ success: false, message: 'Server error: ' + err.message })
  }
}

// ── CONTACT QUERIES ───────────────────────────────────────

const getContactQueries = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contact_queries ORDER BY created_at DESC')
    res.json({ success: true, data: result.rows })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

const updateQueryStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const result = await pool.query(
      'UPDATE contact_queries SET status=$1 WHERE id=$2 RETURNING *',
      [status, id]
    )
    res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ── WEBSITE SETTINGS ──────────────────────────────────────

const getWebsiteSettings = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM website_settings LIMIT 1')
    res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

const updateWebsiteSettings = async (req, res) => {
  try {
    const {
      logo_url, hero_title, hero_subtitle, cta_button_text,
      cta_button_link, contact_email, contact_phone, footer_text
    } = req.body

    const result = await pool.query(
      `INSERT INTO website_settings (id, logo_url, hero_title, hero_subtitle, cta_button_text, cta_button_link, contact_email, contact_phone, footer_text, updated_at)
       VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, NOW())
       ON CONFLICT (id) DO UPDATE SET 
       logo_url=EXCLUDED.logo_url, hero_title=EXCLUDED.hero_title, hero_subtitle=EXCLUDED.hero_subtitle, cta_button_text=EXCLUDED.cta_button_text,
       cta_button_link=EXCLUDED.cta_button_link, contact_email=EXCLUDED.contact_email, contact_phone=EXCLUDED.contact_phone, footer_text=EXCLUDED.footer_text,
       updated_at=NOW()
       RETURNING *`,
      [
        logo_url || null, 
        hero_title || null, 
        hero_subtitle || null, 
        cta_button_text || null,
        cta_button_link || null, 
        contact_email || null, 
        contact_phone || null, 
        footer_text || null
      ]
    )

    res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    console.error('updateWebsiteSettings error:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ── PROFILE ───────────────────────────────────────────────

const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, first_name, last_name, email, phone, address, role, profile_photo, created_at
       FROM users WHERE id=$1`,
      [req.user.id]
    )
    res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

const updateProfile = async (req, res) => {
  try {
    const { first_name, last_name, phone, address, profile_photo } = req.body
    const result = await pool.query(
      `UPDATE users SET first_name=$1, last_name=$2, phone=$3, address=$4, profile_photo=$5
       WHERE id=$6 RETURNING id, first_name, last_name, email, phone, address, profile_photo`,
      [first_name || null, last_name || null, phone || null, address || null, profile_photo || null, req.user.id]
    )
    res.json({ success: true, data: result.rows[0] })
  } catch (err) {
    console.error('Superadmin updateProfile error:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body
    const result = await pool.query('SELECT password_hash FROM users WHERE id=$1', [req.user.id])
    const user = result.rows[0]
    const isValid = await bcrypt.compare(current_password, user.password_hash)
    if (!isValid) return res.status(400).json({ success: false, message: 'Current password is incorrect' })
    const password_hash = await bcrypt.hash(new_password, 10)
    await pool.query('UPDATE users SET password_hash=$1 WHERE id=$2', [password_hash, req.user.id])
    res.json({ success: true, message: 'Password changed successfully' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

module.exports = {
  getSubscriptions, createSubscription, updateSubscription, deleteSubscription,
  getTransactions,
  getAdmins, getManagers, createAdmin, createManager, deleteUser,
  getContactQueries, updateQueryStatus,
  getWebsiteSettings, updateWebsiteSettings,
  getProfile, updateProfile, changePassword
}
