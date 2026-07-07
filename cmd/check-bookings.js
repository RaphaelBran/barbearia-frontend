require('dotenv').config();
const { db } = require('./config/database');

async function checkBookings() {
    try {
        const bookings = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM bookings', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });

        console.log('Agendamentos no banco:');
        console.log(JSON.stringify(bookings, null, 2));
        
        const barbers = await new Promise((resolve, reject) => {
            db.all('SELECT id, name, google_token FROM barbers', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });

        console.log('\nBarbeiros e tokens Google:');
        console.log(JSON.stringify(barbers, null, 2));
        
        process.exit(0);
    } catch (error) {
        console.error('Erro:', error);
        process.exit(1);
    }
}

checkBookings();
