import { View, Text, Image } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

import icons from '@/constants/icons';

interface TabIconOptions {
  focused: boolean;
  icon: any;
  title: string;
};

function TabIcon({ focused, icon, title }: TabIconOptions) {
  return (
    <View className='flex-1 mt-1 flex flex-col items-center'>
      <Image source={icon} tintColor={focused ? '#0061ff' : '#666876'} resizeMode="contain" className="size-6"/>
      <Text className={`${focused ? 'text-primary-300 font-rubik-medium' : 'text-black-200 font-rubik-medium'} text-sm w-full text-center mt-1`}>
      {title}
      </Text>
    </View>
  )};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: 'white',
          position: 'absolute',
          borderTopColor: '#0061FF1A',
          borderTopWidth: 0,
          minHeight: 60,
        }
      }}
    >
      <Tabs.Screen 
        name='index'
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused }) => (  
            <TabIcon focused={focused} icon={icons.home} title='Home' />
          )
        }}
      />
      <Tabs.Screen 
        name='explore'
        options={{
          title: 'Explore',
          headerShown: false,
          tabBarIcon: ({ focused }) => (  
            <TabIcon focused={focused} icon={icons.search} title='Explore' />
          )
        }}
      />
      <Tabs.Screen 
        name='profile'
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ focused }) => (  
            <TabIcon focused={focused} icon={icons.person} title='Profile' />
          )
        }}
      />
      <Tabs.Screen 
        name='create'
        options={{
          title: 'Create',
          headerShown: false,
          tabBarIcon: ({ focused }) => (  
            <TabIcon focused={focused} icon={icons.rightArrow} title='Create' />
          )
        }}
      />
    </Tabs>
  )
}