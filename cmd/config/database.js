const { sql } = require('@vercel/postgres');

// Criar tabelas se não existirem
async function initDatabase() {
    try {
        console.log('Iniciando inicialização do banco de dados...');
        
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
        console.log('Tabela barbers verificada/criada');
        
        // Dropar tabela bookings se existir (para recriar com schema correto)
        console.log('Dropando tabela bookings se existir...');
        await sql`DROP TABLE IF EXISTS bookings CASCADE`;
        console.log('Tabela bookings dropada (se existia)');
        
        // Tabela de agendamentos
        console.log('Criando tabela bookings com schema correto...');
        await sql`
            CREATE TABLE bookings (
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
        console.log('Tabela bookings criada com sucesso');
        
        console.log('Banco de dados Postgres inicializado com sucesso');
    } catch (error) {
        console.error('Erro ao inicializar banco de dados:', error);
        throw error;
    }
}

module.exports = { sql, initDatabase };
