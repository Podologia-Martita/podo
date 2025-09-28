import { useEffect, useState } from 'react';

export default function Booking({ supabase }) {
  const [professionals, setProfessionals] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedProfessional, setSelectedProfessional] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00');
  const [clientName, setClientName] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => { fetchProfessionals(); }, []);

  async function fetchProfessionals() {
    const { data } = await supabase.from('professionals').select('*');
    setProfessionals(data || []);
  }

  async function fetchServices(profId) {
    const { data } = await supabase.from('services').select('*').eq('professional_id', profId);
    setServices(data || []);
  }

  function generateTimeSlots() {
    let slots = [];
    for (let h = 10; h < 18; h++) slots.push(`${String(h).padStart(2,'0')}:00`);
    return slots;
  }

  async function handleProfessionalChange(e) {
    const id = e.target.value;
    setSelectedProfessional(id);
    setSelectedService('');
    fetchServices(id);
  }

  async function handleBook(e) {
    e.preventDefault();
    if (!selectedProfessional || !selectedService || !date || !clientName || !clientContact) {
      setMessage('Completa todos los campos');
      return;
    }
    const timeISO = new Date(`${date}T${time}:00`).toISOString();
    const { error } = await supabase.from('bookings').insert([{
      professional_id: selectedProfessional,
      client_name: clientName,
      client_contact: clientContact,
      service_id: selectedService,
      time: timeISO,
      status: 'PENDIENTE'
    }]);
    if (error) setMessage('Error al crear reserva: ' + error.message);
    else {
      setMessage('Reserva creada. Se enviará confirmación en hasta 1 hora.');
      setClientName(''); setClientContact('');
    }
  }

  return (
    <div>
      <h2>Reservar cita</h2>
      <form onSubmit={handleBook} style={{display:'grid', gap:8, maxWidth:520}}>
        <label>Profesional</label>
        <select value={selectedProfessional} onChange={handleProfessionalChange}>
          <option value=''>-- Selecciona --</option>
          {professionals.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>

        <label>Servicio</label>
        <select value={selectedService} onChange={e => setSelectedService(e.target.value)}>
          <option value=''>-- Selecciona --</option>
          {services.map(s => <option key={s.id} value={s.id}>{s.name} — ${s.price} CLP</option>)}
        </select>

        <label>Fecha</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().slice(0,10)} />

        <label>Hora (bloque 1h, atención 45 min)</label>
        <select value={time} onChange={e => setTime(e.target.value)}>
          {generateTimeSlots().map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <input placeholder="Nombre" value={clientName} onChange={e => setClientName(e.target.value)} />
        <input placeholder="Teléfono o email" value={clientContact} onChange={e => setClientContact(e.target.value)} />
        <button type="submit">Reservar — Crear</button>
      </form>
      {message && <div className="notice">{message}</div>}
      <div style={{marginTop:12,fontSize:13,color:'#555'}}>Nota: La atención dura 45 minutos, pero se bloquea 1 hora para limpieza.</div>
    </div>
  );
}
