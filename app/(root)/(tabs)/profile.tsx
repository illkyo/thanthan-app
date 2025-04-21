import { Text, Alert, Button, View, ScrollView, Image, TouchableOpacity, ImageSourcePropType } from 'react-native';
import React from 'react';
import { supabase } from "@/lib/supabase";
import { useGlobalContext } from '@/lib/global-provider';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '@/constants/icons';
import images from '@/constants/images';
import { settings } from '@/constants/data';

interface SettingsItemOptions {
  icon: ImageSourcePropType;
  title: string;
  onPress?: () => void;
  textStyle?: any;
  showArrow?: boolean;
};

function SettingsItem({ icon, title, onPress, textStyle, showArrow = true }: SettingsItemOptions) {
  return (
    <TouchableOpacity className='flex flex-row items-center justify-between py-3' onPress={onPress}>
      <View className='flex flex-row items-center gap-3'>
        <Image className='size-6' source={icon}/>
        <Text className={`text-lg font-rubik-medium text-black-300 ${textStyle}`}>{title}</Text>
      </View>
      {showArrow && <Image className='size-5' source={icons.rightArrow} />}
    </TouchableOpacity>
  )};

export default function Profile() {
  const { profile, setLoading } = useGlobalContext();

  async function signOut() {
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    if (error) {
      Alert.alert(error.message)
    } else {
      Alert.alert('You have been logged out.')
    }
    setLoading(false)
  };
    
  return (
    <SafeAreaView className='h-full bg-white'>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName='pb-32 px-7'>

        <View className='flex flex-row items-center justify-between mt-5'>
          <Text className='text-xl font-rubik-bold'>Profile</Text>
          <Image className='size-5'source={icons.bell} />
        </View>
        
        <View className='flex-row justify-center flex mt-5'>
          <View className='flex flex-col items-center relative mt-5'>
            <Image className='size-44 relative rounded-full' source={{uri: profile?.avatar}} />
            <TouchableOpacity className='absolute bottom-11 right-2'>
              <Image className='size-9' source={icons.edit} />
            </TouchableOpacity>
            <Text className='text-2xl font-rubik-bold mt-2'>{profile?.name}</Text>
          </View>
        </View>

        <View className='flex flex-col mt-10'>
          <SettingsItem icon={icons.calendar} title={"My Bookings"}/>
          <SettingsItem icon={icons.wallet} title={"Payments"}/>
        </View>

        <View className='flex flex-col mt-5 border-t pt-5 border-primary-200'>
          {settings.slice(2).map((item, index) => (
              <SettingsItem key={index} {...item} />
            ))}
        </View>

        <View className='flex flex-col mt-5 border-t pt-5 border-primary-200'>
          <SettingsItem icon={icons.logout} title='Logout' textStyle='text-danger' showArrow={false} onPress={signOut}/>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
};
