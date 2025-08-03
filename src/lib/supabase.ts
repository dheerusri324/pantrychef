import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  name: string
  created_at: string
}

export interface Recipe {
  id: string
  user_id: string
  name: string
  description: string
  ingredients: string[]
  instructions: string[]
  chefs_tip: string
  image_prompt: string
  status: 'favorite' | 'want-to-try'
  estimated_time?: string
  servings?: number
  cuisine_style?: string
  meal_type?: string
  dietary_needs?: string
  created_at: string
  updated_at: string
}