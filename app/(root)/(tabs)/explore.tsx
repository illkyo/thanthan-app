import icons from "@/constants/icons";
import { Text, View, Image, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Search from '@/components/Search';
import { Card } from '@/components/Cards';
import Filters from "@/components/Filters";
import { router, useLocalSearchParams } from "expo-router";
import { fetchData } from '@/lib/supabase';
import { useEffect, useState } from "react";
import { Property } from '@/lib/data-types';
import NoResults from "@/components/NoResults";

export default function Index() {
  const params = useLocalSearchParams<{ query?: string; filter?: string; }>();
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertiesLoading, setPropertiesLoading] = useState(false);

  async function fetchProperties() {
    try {
      setPropertiesLoading(true);
      console.log(params);
      const data = await fetchData('properties', { filter: params.filter, query: params.query, limit: 20 });
      console.log('Properties Fetched Successfully');
      setProperties(data);
    } catch (error) {
      console.error('Fetch Properties Error:', error);
    } finally {
      setPropertiesLoading(false);
    };
  };

  useEffect(() => {
    fetchProperties();
  }, [params.filter, params.query]);

  const handleCardPress = (id: string) => router.push(`/properties/${id}`);

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList 
          data={properties} 
          renderItem={({ item }) => <Card item={item} onPress={() => handleCardPress(item.id)}/>}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerClassName="pb-32"
          columnWrapperClassName="flex gap-5 px-5"
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={(propertiesLoading) ? <ActivityIndicator size='large' className="text-primary-300 mt-5" /> : <NoResults />}
          ListHeaderComponent={
            <View className="px-5">
              <View className="flex flex-row items-center justify-between mt-5">
                <TouchableOpacity className="flex flex-row bg-primary-200 rounded-full size-11 items-center justify-center" onPress={() => router.back()}>
                  <Image className="size-5" source={icons.backArrow} />
                </TouchableOpacity>
                <Text className="text-base mr-2 text-center font-rubik-medium text-black-300" >Search for your ideal home</Text>
                <Image className="w-6 h-6" source={icons.bell} />
              </View>
              <Search />
              <Filters />
              <View className="mt-5">
                <Text className="text-xl font-rubik-bold text-black-300 mt-5">Found {properties?.length} Properties</Text>
              </View>
            </View>
          }
       />   
    </SafeAreaView>
  );
};
