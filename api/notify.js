import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // Buscar notificaciones pendientes
  const { data: notifications } = await supabase
    .from('notifications_queue')
    .select('*')
    .eq('sent', false);

  for (let n of notifications) {
    // Llamar tu API de WhatsApp / Email
    await fetch('https://tu-api-de-notificaciones.com/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        professional_id: n.professional_id,
        client_name: n.client_name,
        service: n.service,
        time: n.time
      })
    });

    // Marcar como enviada
    await supabase
      .from('notifications_queue')
      .update({ sent: true })
      .eq('id', n.id);
  }

  res.status(200).json({ status: 'done', count: notifications.length });
}

