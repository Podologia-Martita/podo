import { useEffect, useState } from 'react';

export default function PanelProfesional({ supabase }) {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const sub = supabase.auth.onAuthStateChange((_ev, session) => setUser(session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => { if(user) fetchBookings(); }, [user]);

  async function handleLogin(e) {
    e.preventDefault();
    setMessage('');
    const res = await supabase.auth.signInWithPassword({ email, password });
    if (res.error) setMessage('Error: ' + res.error.message);
    else setMessage('Sesión iniciada');
  }

  async function fetchBookings() {
    setMessage('Cargando...');
    const { data, error } = await supabase.from('bookings')
      .select('id, client_name, client_contact, service_id, time, status')
      .eq('professional_id', user?.id)
      .order('time', { ascending: true });
    if (error) setMessage('Error: '+error.message);
    else {
      const { data:servicesData } = await supabase.from('services').select('id,name');
      const servicesMap = (servicesData||[]).reduce((acc,s)=>{ acc[s.id]=s.name; return acc }, {});
      setBookings((data||[]).map(b => ({ ...b, service_name: servicesMap[b.service_id] })));
      setMessage('');
    }
  }

  async function confirmBooking(id) {
    const { error } = await supabase.from('bookings').update({ status:'CONFIRMADO' }).eq('id', id);
    if (error) setMessage('Error: '+error.message); else fetchBookings();
  }

  if(!user) return (
    <div>
      <h2>Panel Profesional — Login</h2>
      <form onSubmit={handleLogin} style={{display:'grid',gap:8,maxWidth:420}}>
        <input placeholder="Correo" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input placeholder="Contraseña" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button type="submit">Entrar</button>
      </form>
      {message && <div className="notice">{message}</div>}
    </div>
  );

  return (
    <div>
      <h2>Panel Profesional</h2>
      <div style={{marginBottom:12}}><strong>{user.email}</strong></div>
      <button onClick={()=>supabase.auth.signOut().then(()=>setUser(null))}>Cerrar sesión</button>
      <div style={{marginTop:16}}>
        <h3>Tus citas</h3>
        {message && <div className="notice">{message}</div>}
        {bookings.length===0 ? <p>No tienes citas.</p> :
        <table>
          <thead><tr><th>Cliente</th><th>Contacto</th><th>Servicio</th><th>Hora</th><th>Estado</th><th></th></tr></thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}>
                <td>{b.client_name}</td>
                <td>{b.client_contact}</td>
                <td>{b.service_name}</td>
                <td>{new Date(b.time).toLocaleString()}</td>
                <td>{b.status}</td>
                <td>{b.status==='PENDIENTE' && <button onClick={()=>confirmBooking(b.id)}>Confirmar</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>}
      </div>
    </div>
  );
}
