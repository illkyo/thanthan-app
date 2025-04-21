import { View, Text, Button, TouchableOpacity, Image, TextInput, ScrollView, Alert, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react'
import icons from '@/constants/icons';
import NumberSelect from '@/components/NumberSelect';
import { supabase } from '@/lib/supabase';
import TypesSelect from '@/components/TypesSelect';
import { fetchEnumTypes, fetchData } from '@/lib/supabase';
import { Property } from '@/lib/data-types';
import { ar } from '@faker-js/faker/.';

export default function EditProperty() {
  const { id } = useLocalSearchParams<{id: string}>();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('');
  const [area, setArea] = useState('');
  const [bedrooms, setBedrooms] = useState<number>(0);
  const [bathrooms, setBathrooms] = useState<number>(0);
  const [image, setImage] = useState('');
  const [geolocation, setGeolocation] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [fetchedTypes, setFetchedTypes] = useState<string[]>([]);
  const [fetchedFacilities, setFetchedFacilities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);

  function validatePropertyData() {
    if (!name || !description || !address || !price || !image) {
      Alert.alert('Please fill the required fields');
    } else if (name.length > 50 || name.length < 5) {
      Alert.alert('Property name must be < 50 characters and > 5 characters');
    } else if (description.length > 255 || description.length < 10) {
      Alert.alert('Description must be < 255 characters and > 10 characters');
    } else if (address.length > 100 || address.length < 10) {
      Alert.alert('Address must be < 100 characters and > 10 characters');
    } else if (!parseFloat(price)) {
      Alert.alert('Price must be a numeric value or float value');
    } else if (area.trim() !== '' && isNaN(Number(area))) {
      Alert.alert('Area must be a numeric integer value');
    } else {
      return true
    }
    return false
  };

  async function confirmPropertyUpdate() {
    const validationResult = validatePropertyData();
    if (validationResult) {
      const { error } = await supabase
      .from('properties')
      .update(
        { 
          name: name, 
          description: description, 
          address: address,
          price: parseFloat(price),
          area: area === '' ? null : +area,
          bedrooms: bedrooms,
          bathrooms: bathrooms,
          image: image,
          geolocation: geolocation === '' ? null : geolocation,
          type: selectedTypes,
          facilities: selectedFacilities
        })
        .eq('id', id);
      if (error) {
        Alert.alert(error.message);
      } else {
        Alert.alert('Property Data Update Successful');
    }}};

    async function fetchAll() {
      try {
        setLoading(true);
        const types = await fetchEnumTypes('type');
        const facilities = await fetchEnumTypes('facilities');
        const propertyData = await fetchData('properties', { equals: { column: 'id', value: id } });
        setProperty(propertyData[0]);
        setFetchedTypes(types);
        setFetchedFacilities(facilities);
      } catch (error) {
        console.error('Fetch Enum Types Error:', error);
      } finally {
        setLoading(false);
    }};

    async function setAll() {
      setLoading(true);
      if (property) {
        setName(property.name);
        setDescription(property.description);
        setAddress(property.address);
        setPrice(property.price.toString());
        setImage(property.image);
        if (property.area) setArea(property.area.toString());
        if (property.bedrooms) setBedrooms(property.bedrooms);
        if (property.bathrooms) setBathrooms(property.bathrooms);
        if (property.geolocation) setGeolocation(property.geolocation);
        if (property.type) {
          setSelectedTypes(property.type)
        };
        if (property.facilities) setSelectedFacilities(property.facilities);
      };
      setLoading(false);
    }
  
    useEffect(() => {
      fetchAll();
    }, []);

    useEffect(() => {
      setAll();
    }, [property]);

  return (
    loading ?       
    <SafeAreaView className="bg-white h-full flex justify-center item-center">
      <ActivityIndicator className="text-primary-300" size='large' />
    </ SafeAreaView> :
    <KeyboardAvoidingView behavior='padding' className='flex flex-1'>
      <ScrollView>
        <SafeAreaView className='p-5'>
          <View className='flex flex-row justify-between'>
            <TouchableOpacity onPress={() => router.back()}>
              <Image className="size-7" source={icons.backArrow}/>
            </TouchableOpacity>
            <TouchableOpacity className='flex justify-center items-center rounded-lg bg-primary-300 w-[60%] h-10' onPress={() => confirmPropertyUpdate()}>
              <Text className='text-white font-rubik-semibold'>Confirm</Text>
            </TouchableOpacity>
          </View>
          <View className='pt-2 pb-2'>
            <Text className='ml-1 font-rubik'>Name *</Text>
            <TextInput
              className={`rounded-lg mt-2 border`}
              onChangeText={(text) => {setName(text)}}
              value={name}
              placeholder="Property"
              autoCapitalize={'none'}
            />
          </View>
          <View className='pt-2 pb-2'>
            <Text className='ml-1 font-rubik'>Description *</Text>
            <TextInput
              multiline={true}
              numberOfLines={10}
              className={`rounded-lg mt-2 border`}
              onChangeText={(text) => {setDescription(text)}}
              value={description}
              placeholder="....."
              autoCapitalize={'none'}
              style={{
                height: 200,
                textAlignVertical: 'top'
              }}
            />
          </View>
          <View className='pt-2 pb-2'>
            <Text className='ml-1 font-rubik'>Address *</Text>
            <TextInput
              className={`rounded-lg mt-2 border`}
              onChangeText={(text) => {setAddress(text)}}
              value={address}
              autoCapitalize={'none'}
            />
          </View>
          <View className='pt-2 pb-2'>
            <Text className='ml-1 font-rubik'>Price *</Text>
            <TextInput
              className={`rounded-lg mt-2 border`}
              onChangeText={(text) => {setPrice(text)}}
              value={price}
              autoCapitalize={'none'}
              keyboardType="numeric"
            />
          </View>
          <View className='pt-2 pb-2'>
            <Text className='ml-1 font-rubik'>Area</Text>
            <TextInput
              className={`rounded-lg mt-2 border`}
              onChangeText={(text) => {setArea(text)}}
              value={area}
              autoCapitalize={'none'}
              keyboardType="numeric"
            />
          </View>
          <View className='pt-2 pb-2'>
            <Text className='ml-1 font-rubik'>Bedrooms</Text>
            <NumberSelect max={9} onNumberPress={(i) => setBedrooms(i)} selected={bedrooms}/>
          </View>
          <View className='pt-2 pb-2'>
            <Text className='ml-1 font-rubik'>Bathrooms</Text>
            <NumberSelect max={9} onNumberPress={(i) => setBathrooms(i)} selected={bathrooms}/>
          </View>
          <View className='pt-2 pb-2'>
            <Text className='ml-1 font-rubik'>Image *</Text>
            <TextInput
              className={`rounded-lg mt-2 border`}
              onChangeText={(text) => {setImage(text)}}
              value={image}
              autoCapitalize={'none'}
            />
          </View>
          <View className='pt-2 pb-2'>
            <Text className='ml-1 font-rubik'>Geolocation</Text>
            <TextInput
              className={`rounded-lg mt-2 border`}
              onChangeText={(text) => {setGeolocation(text)}}
              value={geolocation}
              autoCapitalize={'none'}
            />
          </View>
          <View className='pt-2 pb-2'>
            <Text className='ml-1 font-rubik'>Type</Text>
            <TypesSelect typesArray={fetchedTypes} max={3} onTypePress={(itemArray) => setSelectedTypes(itemArray)} selected={selectedTypes}/>
          </View>
          <View className='pt-2 pb-2'>
            <Text className='ml-1 font-rubik'>Facilities</Text>
            <TypesSelect typesArray={fetchedFacilities} max={fetchedFacilities.length} onTypePress={(itemArray) => setSelectedFacilities(itemArray)} selected={selectedFacilities}/>
          </View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  )};