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
        
        // Tabela de agendamentos - usar ALTER TABLE para renomear coluna se necessário
        console.log('Verificando/criando tabela bookings...');
        
        // Primeiro tenta criar a tabela com schema correto
        try {
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
            console.log('Tabela bookings criada/verificada com schema correto');
        } catch (createError) {
            console.log('Erro ao criar tabela (pode já existir com schema diferente):', createError.message);
            
            // Se a tabela já existe, tenta renomear a coluna "serviço" para "service"
            try {
                console.log('Tentando renomear coluna "serviço" para "service"...');
                await sql`ALTER TABLE bookings RENAME COLUMN "serviço" TO service`;
                console.log('Coluna renomeada com sucesso');
            } catch (renameError) {
                console.log('Erro ao renomear coluna (pode não existir ou já estar correta):', renameError.message);
                
                // Se não conseguir renomear, tenta dropar e recriar
                console.log('Tentando dropar e recriar tabela bookings...');
                await sql`DROP TABLE IF EXISTS bookings CASCADE`;
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
                console.log('Tabela bookings recriada com sucesso');
            }
        }
        
        console.log('Banco de dados Postgres inicializado com sucesso');
    } catch (error) {
        console.error('Erro ao inicializar banco de dados:', error);
        throw error;
    }
}

module.exports = { sql, initDatabase };
