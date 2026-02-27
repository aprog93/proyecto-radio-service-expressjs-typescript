/**
 * Supabase client setup
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './env.js';

// Anon client - use for frontend operations
export const supabaseClient: SupabaseClient = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY
);

// Service role client - use for backend operations (admin)
export const supabaseAdmin: SupabaseClient = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_KEY
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Database = any; // Will be auto-generated from Supabase schema later
