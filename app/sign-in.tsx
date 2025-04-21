import { View, Text, ScrollView, Image, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Auth from '@/components/Auth';
import images from '@/constants/images';
import { useGlobalContext } from '@/lib/global-provider';
import { Redirect } from 'expo-router';
import { useState } from 'react';

export default function SignIn() {
  const { isLoggedIn, loading } = useGlobalContext();
  const [inputFocused, setInputFocused] = useState(false);

  if (!loading && isLoggedIn) return <Redirect href='/' />

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className={`h-full bg-white`}>
          {inputFocused ? null : <Image source={images.onboarding} className='w-full h-3/6' resizeMode="stretch"/>}
          <View className={`px-10 ${inputFocused ? 'mt-32' : ''}`}>
            <Text className='text-center font-rubik uppercase text-base text-black-200'>Welcome to ThanThan</Text>
            <Text className='text-center mt-2 font-rubik-bold text-2xl text-black-300'>
              Let's Get You Closer To {'\n'}
              <Text className='text-primary-300'>Your Ideal Home</Text>
            </Text>
            <Auth onInputFocus={() => setInputFocused(true)} onInputBlur={() => setInputFocused(false)}/>
          </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}