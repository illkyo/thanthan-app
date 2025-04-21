import { router, useLocalSearchParams, usePathname } from 'expo-router';
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import { useDebouncedCallback } from 'use-debounce';
import { useState } from 'react';
import icons from '@/constants/icons';

export default function Search() {
  const path = usePathname();
  const params = useLocalSearchParams<{ query?: string }>();
  const [search, setSearch] = useState(params.query);

  const deBouncedSearch = useDebouncedCallback((text: string) => router.setParams({ query: text }), 500);

  function handleSearch(text: string) {
      setSearch(text);
      deBouncedSearch(text);
  };

  return (
    <View className='flex flex-row items-center justify-between w-full mt-5 px-4 py-2 rounded-lg bg-accent-100 border border-primary-100'>
      <View className='flex-1 flex flex-row items-center justify-start z-50'>
        <Image className='size-5' source={icons.search} />
        <TextInput
          value={search}
          onChangeText={handleSearch}
          placeholder='Search for anything'
          className='text-sm font-rubik text-black-300 ml-2 flex-1'
        />
        <TouchableOpacity>
          <Image className='size-5' source={icons.filter}/>
        </TouchableOpacity>
      </View>
    </View>
  )};