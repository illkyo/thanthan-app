import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { Alert } from "react-native";
import { Profile } from "./data-types";

interface GlobalContextType {
  session: Session | null;
  // setSession: (session: Session | null) => void;
  user: User | null;
  profile: Profile | null;
  isLoggedIn: boolean;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const isLoggedIn = !!user;

  useEffect(() => {

    async function fetchProfile(userId: string) {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, avatar')
        .eq('id', userId)
        .single();
      if (error) {
        Alert.alert('Error fetching profile data');
        console.error(error);
        setProfile(null);
      } else {
        setProfile(data);
      }
    };
    
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setLoading(true);
      setSession(session);
      setUser(session ? session.user : null);
      if (session) await fetchProfile(session.user.id);
      setLoading(false)
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true);
        console.log(`--- AUTH EVENT --- ${event}`);
        setSession(session);
        setUser(session ? session.user : null);
        if (session && event !== 'TOKEN_REFRESHED') await fetchProfile(session.user.id);
        setLoading(false)
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <GlobalContext.Provider value={{ session, user, profile, isLoggedIn, loading, setLoading }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context)
    throw new Error("useGlobalContext must be used within a GlobalProvider");

  return context;
};

export default GlobalProvider;