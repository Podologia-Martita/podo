import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ServiceSelect({ professionalId, onSelect }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('name, price, duration_minutes')
        .eq('professional_id', professionalId);

      if (error) setErrorMsg("Error al cargar: " + error.message);
      else setServices(data || []);

      setLoading(false);
    };
    if (professionalId) fetchServices();
  }, [professionalId]);

  if (loading) return <p>Cargando servicios...</p>;
  if (errorMsg) return <p>{errorMsg}</p>;
  if (services.length === 0) return <p>No hay servicios disponibles.</p>;

  return (
    <select onChange={e => onSelect(e.target.value)}>
      <option value="">-- Selecciona --</option>
      {services.map(s => (
        <option key={s.name} value={s.name}>
          {s.name} - ${s.price}
        </option>
      ))}
    </select>
  );
}
