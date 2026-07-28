const express = require('express');
const { sql } = require('../config/database');
const { createCalendarEvent } = require('../config/google-service');

const router = express.Router();

// Criar agendamento
router.post('/', async (req, res) => {
    const { barber_id, client_name, client_phone, service, price, booking_date, booking_time } = req.body;

    console.log('Payload recebido:', { barber_id, client_name, client_phone, service, price, booking_date, booking_time });

    try {
        // Salvar no banco de dados
        console.log('Tentando inserir no banco...');
        const result = await sql`
            INSERT INTO bookings (barber_id, client_name, client_phone, service, price, booking_date, booking_time)
            VALUES (${barber_id}, ${client_name}, ${client_phone}, ${service}, ${price}, ${booking_date}, ${booking_time})
            RETURNING id
        `;
        console.log('Inserção bem-sucedida, ID:', result.rows[0].id);

        // Criar evento no Google Calendar (assíncrono, não bloqueia a resposta)
        createCalendarEvent({
            client_name,
            client_phone,
            service,
            booking_date,
            booking_time
        }).catch(error => {
            console.error('Erro ao criar evento no Google Calendar:', error);
            // Não falha a resposta se o calendário falhar
        });

        res.json({ success: true, booking: { id: result.rows[0].id, barber_id, client_name, client_phone, service, price, booking_date, booking_time } });
    } catch (error) {
        console.error('Erro ao criar agendamento:', error);
        console.error('Detalhes do erro:', error.message);
        res.status(500).json({ success: false, error: 'Erro ao criar agendamento' });
    }
});

// Listar agendamentos de um barbeiro
router.get('/barber/:barber_id', async (req, res) => {
    const { barber_id } = req.params;

    try {
        const { rows } = await sql`
            SELECT * FROM bookings WHERE barber_id = ${barber_id} ORDER BY booking_date, booking_time
        `;

        res.json({ success: true, bookings: rows });
    } catch (error) {
        console.error('Erro ao listar agendamentos:', error);
        res.status(500).json({ success: false, error: 'Erro ao listar agendamentos' });
    }
});

// Verificar horários disponíveis para um barbeiro em uma data específica
router.get('/available/:barber_id/:date', async (req, res) => {
    const { barber_id, date } = req.params;

    try {
        const { rows } = await sql`
            SELECT booking_time FROM bookings WHERE barber_id = ${barber_id} AND booking_date = ${date}
        `;

        // Converter horários de "20:00:00" para "20:00"
        const bookedTimes = rows.map(row => {
            const time = row.booking_time;
            return time.substring(0, 5); // Pega apenas "HH:MM"
        });
        res.json({ success: true, bookedTimes });
    } catch (error) {
        console.error('Erro ao verificar horários disponíveis:', error);
        res.status(500).json({ success: false, error: 'Erro ao verificar horários disponíveis' });
    }
});

module.exports = router;
