require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/booking');
const calendarRoutes = require('./routes/calendar');
const { initDatabase } = require('./config/database');

const app = express();

console.log('Iniciando servidor...');
console.log('NODE_ENV:', process.env.NODE_ENV);

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database and configure routes
async function configureServer() {
    try {
        console.log('Inicializando banco de dados...');
        await initDatabase();
        console.log('Banco de dados inicializado com sucesso');

        // API Routes
        app.use('/auth', authRoutes);
        app.use('/api/booking', bookingRoutes);
        app.use('/api/calendar', calendarRoutes);

        // Health check endpoint
        app.get('/health', (req, res) => {
            res.json({ status: 'ok', timestamp: new Date().toISOString() });
        });

        return app;
    } catch (error) {
        console.error('Erro fatal ao configurar servidor:', error);
        throw error;
    }
}

// Export configured app for Vercel serverless
module.exports = configureServer();
