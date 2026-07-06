require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/booking');
const calendarRoutes = require('./routes/calendar');
const { initDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from parent directory
const parentDir = path.join(__dirname, '..');
app.use(express.static(parentDir));

// Initialize database
initDatabase().then(() => {
    console.log('Banco de dados inicializado com sucesso');
}).catch(err => {
    console.error('Erro ao inicializar banco de dados:', err);
});

// Routes
app.use('/auth', authRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/calendar', calendarRoutes);

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
