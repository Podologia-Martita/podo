import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL=https://oeczqyusjsbvfchyofuo.supabase.co
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lY3pxeXVzanNidmZjaHlvZnVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwODAzNzgsImV4cCI6MjA3NDY1NjM3OH0.foUxwGTM9ICmI46KO3WxAxf4uuhJycFPyY2q4rHv52k

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

