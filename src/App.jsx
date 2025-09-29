import { useState } from 'react';
import Booking from './Booking.jsx';
import PanelProfesional from './PanelProfesional.jsx';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
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
