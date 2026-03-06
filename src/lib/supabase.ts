import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate URL format
const isValidUrl = (url: string) => {
  try {
    return new URL(url).protocol.startsWith('http');
  } catch (e) {
    return false;
  }
};

const urlToUse = isValidUrl(supabaseUrl) ? supabaseUrl : 'https://placeholder-project.supabase.co';
const keyToUse = supabaseAnonKey || 'placeholder-key';

if (!isValidUrl(supabaseUrl)) {
  console.warn(
    'Invalid or missing VITE_SUPABASE_URL. Using placeholder. ' +
    'Check your .env file.'
  );
}

export const supabase = createClient(urlToUse, keyToUse);
