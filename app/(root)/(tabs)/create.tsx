import { View, Text, Button, TouchableOpacity, Image } from 'react-native';
import { Link, router } from 'expo-router';
import icons from '@/constants/icons';

export default function Create() {
  return (
    <View className='flex justify-center items-center size-full'>
      <TouchableOpacity onPress={() => router.back()}>
        <Image className="size-7" source={icons.backArrow}/>
      </TouchableOpacity>
      <Link href='/create/property' className='text-xl font-rubik text-primary-300' style={{ textDecorationLine: 'underline' }}>Property</Link>
      <Link href='/create/review' className='text-xl font-rubik text-primary-300' style={{ textDecorationLine: 'underline' }}>Review</Link>
    </View>
  )};