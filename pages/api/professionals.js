import { Pool } from 'pg';

// Configura tu conexión PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // tu URL de la base de datos en Vercel
  ssl: {
    rejectUnauthorized: false
  }
});

export default async function handler(req, res) {
  try {
    const result = await pool.query('SELECT id, name FROM professionals ORDER BY name');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener profesionales' });
  }
}
