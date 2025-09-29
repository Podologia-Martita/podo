import { supabase } from './supabaseClient';

export async function fetchProfessionals() {
  const { data, error } = await supabase
    .from('professionals')
    .select('*');

  if (error) console.error('Error fetching professionals:', error);
  return data || [];
}
