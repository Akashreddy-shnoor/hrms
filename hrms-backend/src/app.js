const express = require('express')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

const authRoutes = require('./modules/auth/auth.routes')
const superadminRoutes = require('./modules/admin/superadmin.routes')
const managerRoutes = require('./modules/hr/manager.routes')
const employeeRoutes = require('./modules/hr/employee.routes')
const messageRoutes = require('./modules/messaging/messaging.routes')
const publicRoutes = require('./modules/admin/public.routes')
const profileRoutes = require('./modules/admin/profile.routes')

const app = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/superadmin', superadminRoutes)
app.use('/api/v1/manager', managerRoutes)
app.use('/api/v1/employee', employeeRoutes)
app.use('/api/v1/messages', messageRoutes)
app.use('/api/v1/public', publicRoutes)
app.use('/api/v1/profile', profileRoutes)

app.get('/', (req, res) => {
  res.json({ success: true, message: 'SHNOOR HRMS API is running' })
})

module.exports = app