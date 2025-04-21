import icons from "@/constants/icons";
import { Text, View, Image, TouchableOpacity, FlatList, Button, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Search from '@/components/Search';
import { Card, FeaturedCard } from '@/components/Cards';
import { useGlobalContext } from "@/lib/global-provider";
import Filters from "@/components/Filters";
import { router, useLocalSearchParams } from "expo-router";
import { fetchData, fetchLatestData } from '@/lib/supabase';
import { useEffect, useState } from "react";
import { Property } from '@/lib/data-types';
import NoResults from "@/components/NoResults";

export default function Index() {
  const { profile } = useGlobalContext();
  const params = useLocalSearchParams<{ query?: string; filter?: string; }>();

  const [latestProperties, setLatestProperties] = useState<Property[]>([]);
  const [latestPropertiesLoading, setLatestPropertiesLoading] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertiesLoading, setPropertiesLoading] = useState(false);

  async function fetchLatestProperties() {
    try {
      setLatestPropertiesLoading(true);
      const data = await fetchLatestData('properties');
      console.log('Latest Properties Fetched Successfully');
      setLatestProperties(data);
    } catch (error) {
      console.error('Fetch Latest Properties Error:', error);
    } finally {
      setLatestPropertiesLoading(false);
    };
  };

  async function fetchProperties() {
    try {
      setPropertiesLoading(true);
      const data = await fetchData('properties', { filter: params.filter, query: params.query, limit: 6 });
      console.log('Properties Fetched Successfully');
      setProperties(data);
    } catch (error) {
      console.error('Fetch Properties Error:', error);
    } finally {
      setPropertiesLoading(false);
    };
  };

  useEffect(() => {
    fetchLatestProperties();
  }, []);

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
            <View className="flex flex-row item-center justify-between">
              <View className="flex flex-row items-center">
                <Image source={{ uri: profile?.avatar }} className="size-12 rounded-full"/>
                <View className="flex flex-col items-start ml-2 justify-center">
                  <Text className="text-xs font-rubik text-black-100">Good Morning</Text>
                  <Text className="text-base font-rubik-medium text-black-300">{profile?.name}</Text>
                </View>
              </View>
              <Image source={icons.bell} className="size-6"/>
            </View>
            <Search />
            <View className="my-5">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-xl font-rubik-bold text-black-300">Featured</Text>
                <TouchableOpacity>
                  <Text className="text-base font-rubik-bold text-primary-300">See All</Text>
                </TouchableOpacity>
              </View>
              {latestPropertiesLoading ? <ActivityIndicator size='large' className="text-primary-300" /> : 
              (!latestProperties || latestProperties.length === 0 ? <NoResults /> :
                <FlatList horizontal 
                data={latestProperties} 
                renderItem={({ item }) => <FeaturedCard item={item} onPress={() => handleCardPress(item.id)} />} 
                keyExtractor={(item) => item.id.toString()}
                bounces={false}
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="flex gap-5 mt-5"
                />  
              )}
            </View>
            <View className="flex flex-row items-center justify-between">
              <Text className="text-xl font-rubik-bold text-black-300">Our Recommendation</Text>
              <TouchableOpacity>
                <Text className="text-base font-rubik-bold text-primary-300">See All</Text>
              </TouchableOpacity>
            </View>
            <Filters />
          </View>
          }
       />   
    </SafeAreaView>
  );
};
