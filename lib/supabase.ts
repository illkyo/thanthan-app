import { AppState } from 'react-native'
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_PROJECT_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
});

export async function fetchEnumTypes(typeName: string) {
  const { data, error } = await supabase.rpc('get_enum_values', { enum_type: typeName });
  if (error) throw new Error(error.message);
  return data;
};

export async function fetchData(
  tableName: string, 
  options?: {
    sortedBy?: string;
    equals?: {
      column: string,
      value: string
    };
    filter?: string;
    query?: string;
    limit?: number;
  }
) {
    let fetchQuery = supabase.from(tableName).select();
    if (options?.sortedBy) fetchQuery = fetchQuery.order(options.sortedBy, { ascending: false });
    if (options?.equals) fetchQuery = fetchQuery.eq(options?.equals?.column, options?.equals?.value);
    if (options?.filter && options?.filter !== 'All') fetchQuery.contains('type', [options.filter]);
    if (options?.query) fetchQuery.or(`name.ilike.%${options.query}%,address.ilike.%${options.query}%`);
    if (options?.limit) fetchQuery.limit(options.limit);
    const { data, error } = await fetchQuery;
    if (error) throw new Error(error.message);
    return data;
};

export async function fetchLatestData(tableName: string) {
  return fetchData(tableName, { sortedBy: 'created_at', limit: 5 })
}

export async function deleteData(tableName: string, column: string, value: string) {
  const { error } = await supabase.from(tableName).delete().eq(column, value);
  if (error) throw new Error(error.message);
  return
}