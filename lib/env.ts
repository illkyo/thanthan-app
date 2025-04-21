import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_PROJECT_URL!;
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
export const SUPABASE_ROLE_KEY = process.env.EXPO_PUBLIC_SUPABASE_ROLE_KEY!;

if (!SUPABASE_URL) throw new Error("Missing SUPABASE_URL");
if (!SUPABASE_ANON_KEY) throw new Error("Missing SUPABASE_ANON_KEY");
if (!SUPABASE_ROLE_KEY) throw new Error("Missing SUPABASE_ROLE_KEY");