import { View, Text, ScrollView, TouchableOpacity, Button, ActivityIndicator } from 'react-native'
import { useState, useEffect } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { fetchEnumTypes } from '@/lib/supabase';

export default function Filters() {
  const params = useLocalSearchParams<{filter?: string}>();
  const [selectedCategory, setSelectedCategory] = useState(params.filter || 'All');
  const [filtersLoading, setFiltersLoading] = useState(false);
  const [filters, setFilters] = useState<string[]>(['All']);

  function handleCategoryPress(category: string){
    if (selectedCategory === category) {
      setSelectedCategory('All');
      router.setParams({ filter: 'All' });
      return;
    };
    setSelectedCategory(category);
    router.setParams({ filter: category });
  };

  async function fetchFilters() {
    try {
      setFiltersLoading(true);
      const types = await fetchEnumTypes('type');
      filters.push(...types);
      setFilters(filters);
    } catch (error) {
      console.error('Fetch Filters Error:', error);
    } finally {
      setFiltersLoading(false);
    }};

  useEffect(() => {
    fetchFilters();
  }, []);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className='mt-3 mb-2'>
      {/* <Button color="#0061FF" title="Log Types" onPress={() => console.log(types)} /> */}
      {filtersLoading ? <ActivityIndicator size='large' className="text-primary-300" /> : filters.map((item: string, index: number) => (
        <TouchableOpacity className={`flex flex-col items-start mr-4 px-4 py-2 rounded-full ${selectedCategory === item ? 'bg-primary-300' : 'bg-primary-100 border border-primary-200'}`} onPress={() => handleCategoryPress(item)} key={index}>
          <Text className={`text-sm ${selectedCategory === item ? 'text-white font-rubik-bold mt-0.5' : 'text-black-300 font-rubik'}`}>{item}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )};