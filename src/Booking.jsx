import { useEffect, useState } from 'react';
import { fetchProfessionals } from './fetchProfessionals';

export default function Booking({ supabase }) {
  const [professionals, setProfessionals] = useState([]);
  const [selectedProfessional, setSelectedProfessional] = useState('');
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [time, setTime] = useState('');

  // Traer profesionales
  useEffect(() => {
    fetchProfessionals().then(data => setProfessionals(data));
  }, []);

  // Traer servicios según profesional seleccionado
  useEffect(() => {
    if (!selectedProfessional) return;

    supabase
      .from('services')
      .select('*')
      .eq('professional_id', selectedProfessional)
      .then(({ data, error }) => {
        if (error) console.error(error);
        else setServices(data);
      });
  }, [selectedProfessional]);

  // Guardar reserva
  const handleBooking = async () => {
    if (!selectedProfessional || !selectedService || !time) {
      alert('Por favor completa todos los campos');
      return;
    }

    const { error } = await supabase.from('bookings').insert([
      {
        professional_id: selectedProfessional,
        service: selectedService,
        client_name: 'Cliente de prueba', // Puedes reemplazar por login real
        time
      }
    ]);

    if (error) console.error(error);
    else alert('Cita reservada con éxito!');
  };

  return (
    <div>
      <h2>Reservar cita</h2>

      <div>
        <label>Profesional:</label>
        <select value={selectedProfessional} onChange={e => setSelectedProfessional(e.target.value)}>
          <option value="">Selecciona un profesional</option>
          {professionals.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Servicio:</label>
        <select value={selectedService} onChange={e => setSelectedService(e.target.value)}>
          <option value="">Selecciona un servicio</option>
          {services.map(s => (
            <option key={s.id} value={s.name}>
              {s.name} - ${s.price} CLP ({s.duration_minutes} min)
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Hora (10:00 - 18:00):</label>
        <input
          type="time"
          min="10:00"
          max="18:00"
          value={time}
          onChange={e => setTime(e.target.value)}
        />
      </div>

      <button onClick={handleBooking} style={{ marginTop: 10 }}>
        Reservar
      </button>
    </div>
  );
}

