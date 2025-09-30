import { useState } from 'react';
import Booking from './Booking.jsx';
import PanelProfesional from './PanelProfesional.jsx';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL=https://oeczqyusjsbvfchyofuo.supabase.co,
  import.meta.env.VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lY3pxeXVzanNidmZjaHlvZnVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwODAzNzgsImV4cCI6MjA3NDY1NjM3OH0.foUxwGTM9ICmI46KO3WxAxf4uuhJycFPyY2q4rHv52k
);

export default function App() {
  const [view, setView] = useState('booking');

  return (
    <div className="container">
      <div className="header">
        <h1>Podología Martita</h1>
        <div>
          <button onClick={() => setView('booking')}>Reservar cita</button>
          <button style={{ marginLeft: 8 }} onClick={() => setView('panel')}>Panel profesional</button>
        </div>
      </div>

      {view === 'booking' && <Booking supabase={supabase} />}
      {view === 'panel' && <PanelProfesional supabase={supabase} />}
    </div>
  );
}
