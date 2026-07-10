const { google } = require('googleapis');
const { JWT } = require('google-auth-library');

// Configurar cliente JWT para Service Account
function getCalendarClient() {
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    
    if (!serviceAccountKey) {
        console.error('GOOGLE_SERVICE_ACCOUNT_KEY não configurado');
        return null;
    }

    try {
        // Parse a chave JSON da variável de ambiente
        const keyFile = JSON.parse(serviceAccountKey);
        
        // Criar cliente JWT
        const jwtClient = new JWT({
            email: keyFile.client_email,
            key: keyFile.private_key,
            scopes: ['https://www.googleapis.com/auth/calendar'],
            subject: process.env.GOOGLE_CALENDAR_ID // Opcional: para agendar em nome de outro usuário
        });

        return jwtClient;
    } catch (error) {
        console.error('Erro ao configurar cliente JWT:', error);
        return null;
    }
}

// Criar evento no Google Calendar
async function createCalendarEvent(eventData) {
    const jwtClient = getCalendarClient();
    
    if (!jwtClient) {
        throw new Error('Cliente JWT não configurado');
    }

    try {
        // Autorizar o cliente
        await jwtClient.authorize();

        // Criar cliente do Calendar
        const calendar = google.calendar({ version: 'v3', auth: jwtClient });

        // ID do calendário (usar 'primary' para o calendário da service account ou um ID específico)
        const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

        // Criar evento
        const event = {
            summary: `Agendamento: ${eventData.service} - ${eventData.client_name}`,
            description: `Agendamento de ${eventData.service} para ${eventData.client_name}\nTelefone: ${eventData.client_phone}`,
            start: {
                dateTime: `${eventData.booking_date}T${eventData.booking_time}:00-03:00`,
                timeZone: 'America/Sao_Paulo'
            },
            end: {
                dateTime: `${eventData.booking_date}T${eventData.booking_time}:30-03:00`,
                timeZone: 'America/Sao_Paulo'
            },
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'email', minutes: 1440 }, // 1 dia antes
                    { method: 'popup', minutes: 60 }    // 1 hora antes
                ]
            }
        };

        const response = await calendar.events.insert({
            calendarId: calendarId,
            resource: event
        });

        console.log('Evento criado no Google Calendar:', response.data.id);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar evento no Google Calendar:', error);
        throw error;
    }
}

module.exports = { createCalendarEvent };
