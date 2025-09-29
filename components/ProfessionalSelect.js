import ProfessionalSelect from '../components/ProfessionalSelect';
import { useState } from 'react';

export default function Home() {
  const [selectedProfessional, setSelectedProfessional] = useState('');

  return (
    <div>
      <h1>Reserva tu cita</h1>
      <ProfessionalSelect onSelect={setSelectedProfessional} />

      {selectedProfessional && (
        <p>Has seleccionado al profesional con ID: {selectedProfessional}</p>
      )}
    </div>
  );
}
