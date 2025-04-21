import { useState } from 'react';
import { Alert, View, TextInput, Button, Text } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useGlobalContext } from '@/lib/global-provider';

export default function Auth({ onInputFocus, onInputBlur }: { onInputFocus: () => void, onInputBlur: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const { isLoggedIn, loading, setLoading } = useGlobalContext();
  
  async function signInWithEmail() {
    setLoading(true);
    if (!email || !password) {
      Alert.alert('Please fill the fields');
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) Alert.alert(error.message);
    };
    setLoading(false);
  };

  async function signUpWithEmail() {
    setLoading(true);
    if (!email || !password) {
      Alert.alert('Please fill the fields');
    } else {
      const { error } = await supabase.auth.signUp({ 
        email: email, 
        password: password,
      });
      if (error) Alert.alert(error.message);
    };
    setLoading(false);
  };
  
  // async function signInWithEmailDhivehi() {
  //   setLoading(true);
  //   if (!email || !password) {
  //     Alert.alert('ފީލްޑުތައް ފުރުއްވާލައްވާ') 
  //   } else {
  //     const { error } = await supabase.auth.signInWithPassword({
  //       email: email,
  //       password: password,
  //     });
  
  //     if (error) {
  //       if (error.message === 'Invalid login credentials') {
  //         Alert.alert('ރެޖިސްޓަރ ކޮށްލައްވާ ނުވަތަ ޕާސްވޯޑު ރަނގަޅަށް ޖައްސަވާ');
  //       } else  if (error.message === 'Email not confirmed'){
  //         Alert.alert('އީމެއިލް ކޮންފޯމްކޮށްލައްވާ');
  //       } else {
  //         Alert.alert(error.message);
  //       }
  //     }
  //   }
  //   setLoading(false);
  // };

  // async function signUpWithEmailDhivehi() {
  //   setLoading(true)
  //   if (!email || !password) {
  //     Alert.alert('ފީލްޑުތައް ފުރިހަމަކޮއްލައްވާ')
  //   } else {
  //     const { data, error } = await supabase.auth.signUp({ 
  //       email: email, 
  //       password: password,
  //     })

  //     if (error) {
  //       Alert.alert(error.message);
  //     } else if (data.user?.identities?.length === 0) {
  //       Alert.alert('ތި މެއިލް އެޑްރެހާ އެކީ ޔޫސަރެއް ރެޖިސްޓަރ ވެފައިވޭ');
  //     } else {
  //       Alert.alert('މެއިލް ޗެކުކޮށްލައްވާ');
  //     }
  //   }
  //   setLoading(false)
  // };

  // async function createSessionFromUrl(url: string) {
  //   setLoading(true);
  //   const { params, errorCode } = QueryParams.getQueryParams(url);
  
  //   if (errorCode) throw new Error(errorCode);  
  //   const { access_token, refresh_token } = params;
  
  //   if (!access_token) return;
  
  //   const { data: {session}, error } = await supabase.auth.setSession({
  //     access_token,
  //     refresh_token,  
  //   });
  
  //   if (error) throw error;
  //   setSession(session);
  //   setLoading(false);
  // };

  // async function createSessionFromUrl(url: string) {
  //   setLoading(true);
  //   try {
  //     const { params, errorCode } = QueryParams.getQueryParams(url);
  //     if (errorCode) throw new Error(errorCode);
      
  //     const { access_token, refresh_token } = params;
  //     if (!access_token) {
  //       console.warn("No access_token found in URL.");
  //       return;
  //     }
    
  //     const { data: { session }, error } = await supabase.auth.setSession({
  //       access_token,
  //       refresh_token,
  //     });
    
  //     if (error) throw error;
      
  //     console.log("Session created, updating global context");
  //     setSession(session);
  //   } catch (error) {
  //     console.error("Error in deep link session creation:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  // const url = Linking.useURL();
  // useEffect(() => {
  //   if (url && url.includes('access_token')) {
  //     createSessionFromUrl(url);
  //   }
  // }, [url]);

  return (
    <View className='p-5'>
      <View className='pt-2 pb-2'>
        <Text className='ml-1 font-rubik'>Email</Text>
        <TextInput
          className={`border rounded-lg mt-2 ${emailFocused ? 'border-2 border-primary-300' : 'border-black-200' }`}
          onChangeText={(text) => setEmail(text)}
          onFocus={() => {
            setEmailFocused(true);
            onInputFocus();
          }}
          onBlur={() => {
            setEmailFocused(false);
            onInputBlur();
          }}
          value={email}
          placeholder="misaalu@example.com"
          autoCapitalize={'none'}
        />
      </View>
      <View className='pb-2 pt-2'>
        <Text className='ml-1 font-rubik'>Password</Text>
        <TextInput
          className={`border rounded-lg mt-2 ${passwordFocused ? 'border-2 border-primary-300' : 'border-black-200' }`}
          onChangeText={(text) => setPassword(text)}
          onFocus={() => {
            setPasswordFocused(true);
            onInputFocus();
          }}
          onBlur={() => {
            setPasswordFocused(false);
            onInputBlur();
          }}
          value={password}
          secureTextEntry={true}
          placeholder="********"
          autoCapitalize={'none'}
        />
      </View>
      <View className='flex flex-row mt-6 justify-between'>
        <View className='w-[40%]'>
          <Button color="#0061FF" title="Login" disabled={loading || isLoggedIn} onPress={() => signInWithEmail()} />
        </View>
        <View className='w-[40%]'>
          <Button color="#0061FF" title="Register" disabled={loading} onPress={() => signUpWithEmail()} />
        </View>
      </View>
    </View>
  )
}