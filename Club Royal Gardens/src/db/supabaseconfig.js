import { createClient } from '@supabase/supabase-js';

// Supabase Client Setup
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("supaURL:", supabaseUrl, "supabaseKey:", supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Las variables de entorno no están definidas correctamente");
}

const supaConetion = createClient(supabaseUrl, supabaseAnonKey);

export default supaConetion;