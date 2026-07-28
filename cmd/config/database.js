const { sql } = require('@vercel/postgres');

// Criar tabelas se não existirem
async function initDatabase() {
    try {
        // Tabela de barbeiros
        await sql`
            CREATE TABLE IF NOT EXISTS barbers (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                whatsapp TEXT NOT NULL,
                instagram TEXT,
                instagram_handle TEXT,
                photo TEXT,
                google_token TEXT,
                google_refresh_token TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        
        // Tabela de agendamentos
        await sql`
            CREATE TABLE IF NOT EXISTS bookings (
                id SERIAL PRIMARY KEY,
                barber_id INTEGER,
                client_name TEXT NOT NULL,
                client_phone TEXT NOT NULL,
                service TEXT NOT NULL,
                price REAL,
                booking_date TEXT NOT NULL,
                booking_time TEXT NOT NULL,
                calendar_event_id TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (barber_id) REFERENCES barbers(id)
            )
        `;
        
        console.log('Banco de dados Postgres inicializado com sucesso');
    } catch (error) {
        console.error('Erro ao inicializar banco de dados:', error);
        throw error;
    }
}

module.exports = { sql, initDatabase };
