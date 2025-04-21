import { View, Text, Button, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import React from 'react'
import icons from '@/constants/icons';

export default function CreateReview() {
  return (
    <SafeAreaView>
      <Text>Review</Text>
      <TouchableOpacity onPress={() => router.back()}>
        <Image className="size-7" source={icons.backArrow}/>
      </TouchableOpacity>
    </SafeAreaView>
  )};