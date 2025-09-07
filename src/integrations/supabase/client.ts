
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://nhdmnjdilcqbexdaiiwr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oZG1uamRpbGNxYmV4ZGFpaXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMDU0NDQsImV4cCI6MjA3MTg4MTQ0NH0.MAsmqPr1xZDIcnxzSjtr7fXo5UPIRVC2ObJOHICP-Ts";


export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});