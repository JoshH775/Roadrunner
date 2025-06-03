import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || ''
const supabasePublicKey = process.env.VITE_SUPABASE_PUBLIC_KEY || ''

export const supabase = createClient(supabaseUrl, supabasePublicKey)