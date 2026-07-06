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

console.log('Iniciando servidor...');
console.log('PORT:', PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from parent directory
const parentDir = path.join(__dirname, '..');
console.log('Servindo arquivos estáticos de:', parentDir);
app.use(express.static(parentDir));

// Initialize database before starting server
async function startServer() {
    try {
        console.log('Inicializando banco de dados...');
        await initDatabase();
        console.log('Banco de dados inicializado com sucesso');

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

        // Start server
        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
            console.log('Ambiente:', process.env.NODE_ENV || 'development');
        });
    } catch (error) {
        console.error('Erro fatal ao iniciar servidor:', error);
        process.exit(1);
    }
}

startServer();
