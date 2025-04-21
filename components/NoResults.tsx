import { View, Text, Image } from 'react-native'
import React from 'react'
import images from '@/constants/images'

export default function NoResults() {
  return (
    <View className='flex items-center my-5'>
      <Image className='w-11/12 h-80' source={images.noResult} resizeMode='contain' />
      <Text className='text-2xl font-rubik-bold text-black-300 mt-5'>No Results</Text>
      <Text className='text-base text-black-100 mt-2'>We could not find any results</Text>
    </View>
  )
}