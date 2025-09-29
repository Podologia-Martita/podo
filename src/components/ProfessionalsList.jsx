import { useEffect, useState } from 'react';
import { fetchProfessionals } from '../fetchProfessionals'; // nota el ../ si fetchProfessionals.js está en src/

function ProfessionalsList() {
  const [professionals, setProfessionals] = useState([]);

  useEffect(() => {
    fetchProfessionals().then(data => setProfessionals(data));
  }, []);

  return (
    <div>
      {professionals.length === 0 && <p>No hay profesionales disponibles</p>}
      {professionals.map(p => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  );
}

export default ProfessionalsList;

