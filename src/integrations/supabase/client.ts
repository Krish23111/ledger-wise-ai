// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tyoutxrtgylczumdbbsm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5b3V0eHJ0Z3lsY3p1bWRiYnNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NTkyODgsImV4cCI6MjA2NTIzNTI4OH0.NSB5anBQMHR9sT2kLM1bOsh_l5wlnmnutXdvTZS5gSo";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);