import { useEffect, useState } from 'react';

export default function AvailableSlots({ professionalId, serviceName, date, onSelect }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlots = async () => {
      const baseHour = 10;
      const hours = Array.from({ length: 8 }, (_, i) => `${String(baseHour + i).padStart(2,'0')}:00`);
      setSlots(hours);
      setLoading(false);
    };
    fetchSlots();
  }, [professionalId, serviceName, date]);

  if (loading) return <p>Cargando horarios...</p>;
  if (!slots.length) return <p>No hay horarios disponibles.</p>;

  return (
    <select onChange={e => onSelect(`${date}T${e.target.value}:00`)}>
      <option value="">-- Selecciona --</option>
      {slots.map(h => (
        <option key={h} value={h}>{h}</option>
      ))}
    </select>
  );
}
