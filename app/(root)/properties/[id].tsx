import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet, Button, ScrollView, Dimensions, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import icons, { IconName } from "@/constants/icons";
import { deleteData, fetchData } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { Property, Gallery, Review, Profile } from '@/lib/data-types';
import { SafeAreaView } from 'react-native-safe-area-context';
import Carousel from '@/components/Carousel';
import images from '@/constants/images';
import { useGlobalContext } from '@/lib/global-provider';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

export default function PropertyDetail() {
  const { id } = useLocalSearchParams<{id: string}>();
  const [fetchLoading, setFetchLoading] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ownerProfile, setOwnerProfile] = useState<Profile | null>(null);
  const [latestReviewerProfile, setLatestReviewerProfile] = useState<Profile | null>(null);
  const [carouselImages, setCarouselImages] = useState<string[] | null>(null);

  const { profile, setLoading } = useGlobalContext();

  async function fetchAll() {
    try {
      setFetchLoading(true);
      console.log(id);
      const propertyData = await fetchData('properties', { equals: { column: 'id', value: id } });
      console.log('Property Fetched Successfully');
      setProperty(propertyData[0]);
      const galleryData = await fetchData('galleries', { equals: { column: 'property_id', value: id } });
      console.log('Gallery Fetched Successfully');
      setGallery(galleryData[0]);
      const reviewsData = await fetchData('reviews', { sortedBy: 'created_at', equals: { column: 'property_id', value: id } });
      console.log('Reviews Fetched Successfully');
      setReviews(reviewsData);
    } catch (error) {
      console.error('Fetch Error:', error);
    } finally {
      setFetchLoading(false);
  }};

  async function fetchProfile(
    Id: {
      owner?: string;
      latestReviewer?: string
    },
  ) {
    try {
      setFetchLoading(true);
      if (Id.owner) {
        const ownerProfileData = await fetchData('profiles', { equals: { column: 'id', value: Id.owner } });
        console.log('Owner Profile Fetched Successfully');
        setOwnerProfile(ownerProfileData[0]);
      } else if (Id.latestReviewer) {
        const latestReviwerprofileData = await fetchData('profiles', { equals: { column: 'id', value: Id.latestReviewer } });
        console.log('Reviewer Profile Fetched Successfully');
        setLatestReviewerProfile(latestReviwerprofileData[0]);
      }
    } catch (error) {
      console.error('Profiles Fetch Error:', error);
    } finally {
      setFetchLoading(false);
    };
  }

  async function handleDelete() {
    router.back();
    const tempVar = id;
    setLoading(true);
    await deleteData('properties', 'id', id);
    setLoading(false);
    Alert.alert(`Property ID ${tempVar} Deleted`);
  }

  // needs improvement
  // function getTimePassed(datePosted: string) {
  //   const pastDate = new Date(datePosted).getTime();
  //   const now = Date.now();

  //   const diffMs = now - pastDate;

  //   const seconds = Math.round(diffMs / 1000);
  //   const minutes = Math.round(seconds / 60);
  //   const hours = Math.round(minutes / 60);
  //   const days = Math.round(hours / 24);
  
  //   return `${days} days ago`;
  // }

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    if (property) fetchProfile({ owner: property.owner_id });
    if (reviews.length > 0) {
      fetchProfile({ latestReviewer: reviews[0].reviewer_id });
    };
    if (property && gallery) setCarouselImages([property.image, ...gallery.images]);
  }, [property, gallery, reviews]);

  return (
    fetchLoading ?       
    <SafeAreaView className="bg-white h-full flex justify-center item-center">
      <ActivityIndicator className="text-primary-300" size='large' />
    </ SafeAreaView> :
    <ScrollView className='relative bg-white '>
      {carouselImages ? <Carousel data={carouselImages} size={styles.carouselImageSize} /> : <Image source={{uri: property?.image}} style={styles.carouselImageSize} resizeMode="stretch"/>}
      {/* <Button title="Log Carousel" onPress={() => {console.log(carouselImages)}} /> */}
      <View className="absolute top-10 left-0 right-0 flex flex-row items-center justify-between px-5 py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Image className="size-7" source={icons.backArrow} style={styles.overlayButtonColor}/>
        </TouchableOpacity>
        <View className="flex flex-row gap-3">
          <TouchableOpacity>
            <Image className="size-7" source={icons.heart} style={styles.overlayButtonColor}/>
          </TouchableOpacity>
          <TouchableOpacity>
            <Image className="size-7" source={icons.send} style={styles.overlayButtonColor}/>
          </TouchableOpacity>
        </View>
      </View>
      <View className='p-5 flex flex-col gap-5'>
        <View className='border-b border-gray-100 pb-5'>
          <Text>{property?.id}</Text>
          <View className='flex flex-row justify-between'>
            <Text className='text-2xl font-rubik-bold'>{property?.name}</Text>
            {
              profile?.id === ownerProfile?.id ? 
              <View className='flex flex-row gap-2'>
                <TouchableOpacity className='bg-accent-100 p-2 rounded-full text-primary-300' onPress={() => handleDelete()}>
                  <Text className='text-base font-rubik-bold text-danger'>DELETE</Text>
                </TouchableOpacity>
                <TouchableOpacity className='bg-accent-100 p-2 rounded-full text-primary-300' onPress={() => router.push(`/edit/${id}`)}>
                  <Text className='text-base font-rubik-bold text-primary-300'>UPDATE</Text>
                </TouchableOpacity>
              </View>: null
            }
          </View>
          <View className='flex flex-row gap-4 mt-1'>
            {property?.type.length ?
              <Text className='text-sm font-rubik-bold bg-accent-100 p-2 rounded-full text-primary-300'>{property?.type[0].toUpperCase()}</Text>
              : <Text className='text-sm font-rubik-bold bg-accent-100 p-2 rounded-full text-primary-300'>PROPERTY</Text>
            }
            <View className='flex flex-row gap-2 mt-1'>
              <Image source={icons.star} className="size-5"/>
              <Text className='text-sm font-rubik-semibold text-black-100 mt-1'>{property?.rating} ({reviews?.length} reviews)</Text>
            </View>
          </View>
          <View className='flex flex-row gap-4'>
            {property?.bedrooms ? 
              <View className='flex flex-row gap-2'>
                <View className='flex items-center justify-center bg-accent-100 rounded-full size-10'>
                  <Image className="size-4" source={icons.bed} />
                </View>
                <Text className='text-sm font-rubik-bold text-black-200 mt-3'>{property?.bedrooms} Beds</Text>
              </View> : null}
            {property?.bathrooms ?
              <View className='flex flex-row gap-2'>
                <View className='flex items-center justify-center bg-accent-100 rounded-full size-10'>
                  <Image className="size-4" source={icons.bath} />
                </View>
                <Text className='text-sm font-rubik-bold text-black-200 mt-3'>{property.bathrooms} Bath</Text>
              </View> : null}
            {property?.area ?             
              <View className='flex flex-row gap-2'>
                <View className='flex items-center justify-center bg-accent-100 rounded-full size-10'>
                  <Image className="size-4" source={icons.area} />
                </View>
                <Text className='text-sm font-rubik-bold text-black-200 mt-3'>{property.area} m2</Text>
              </View> : null}
          </View>
        </View>

        <View>
          <Text className='text-xl font-rubik-bold text-black-300'>Owner</Text>
          <View className='flex flex-row justify-between'>
            <View className='flex flex-row gap-2'>
              <Image className="size-14 rounded-full mt-1" source={{ uri: ownerProfile?.avatar }}/>
              <Text className='font-rubik-medium mt-5'>{ownerProfile?.name.split(/[._\-\d]/)[0]}</Text>
            </View>
            <View className='flex flex-row gap-5 mt-2'>
              <TouchableOpacity>
                <Image source={icons.chat} className="size-7 rounded-full mt-2"/>
              </TouchableOpacity>
              <TouchableOpacity>
                <Image source={icons.phone} className="size-7 rounded-full mt-2"/>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className='flex gap-2'>
          <Text className='text-xl font-rubik-bold text-black-300'>Overview</Text>
          <Text className='text-md leading-7 font-rubik text-black-200'>{property?.description}</Text>
        </View>

        <View className='flex gap-2'>
          <Text className='text-xl font-rubik-bold text-black-300'>Facilities</Text>
          <View className="flex flex-row flex-wrap gap-10 justify-center items-center">
          {property?.facilities?.length ?
            property?.facilities.map((item, index) => {
              const transformedItem = item === 'Convenience Stores' ? 'store' : item;
              const iconName = transformedItem.toLowerCase() as IconName;
              return (
                <View key={index} className="flex justify-center items-center">
                  <View className="flex items-center justify-center bg-accent-100 rounded-full size-16">
                    <Image className="size-8" source={icons[iconName]} style={styles.facilitiesIconColor} />
                  </View>
                  <Text className='text-sm'>{item}</Text>
                </View>
              )}) : <Text className='text-sm font-rubik-light text-black-200 text-left w-full'>No facilities listed</Text>}
          </View>
        </View>
        
        <View className='flex gap-4'>
          <Text className='text-xl font-rubik-bold text-black-300'>Gallery</Text>
          <View className='flex flex-row gap-4'>
          {carouselImages ? 
          carouselImages.map((item, index) => {
            if (index < 2) {
              return (
                <TouchableOpacity key={index} className='flex-1 h-28'>
                  <Image className='size-full rounded-xl' source={{uri: item}} />
                </TouchableOpacity>
              ) 
            } else if (index === carouselImages.length - 1) {
              return (
                <TouchableOpacity key={index} className='flex-1 h-28 relative'>
                  <Image className='size-full rounded-xl' source={{uri: item}}/>
                  <View className="absolute inset-0 rounded-xl bg-black opacity-40" />
                  <Text className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-rubik-bold text-xl text-white'>{index-1}+</Text>
                </TouchableOpacity>
              )
            }
          })
          : <Image className='flex-1 h-40 rounded-xl' source={{uri: property?.image}}/>}
          </View>
        </View>

        <View className='flex gap-2'>
          <Text className='text-xl font-rubik-bold text-black-300'>Location</Text>
          <View className='flex flex-row gap-2'>
            <Image className='size-5' source={icons.location} />
            <Text className='font-rubik-medium text-black-200'>{property?.address}</Text>
          </View>
          <Image className='w-full h-48' source={images.map} />
        </View>
        
        {reviews?.length > 0 ?
          (<View className='flex gap-2 pb-8'>
            <TouchableOpacity className='flex flex-row justify-between'>
              <View className='flex flex-row gap-2'>
                <Image className='size-5' source={icons.star} />
                <Text className='text-xl font-rubik-bold text-black-300'>{(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)} ({reviews.length} reviews)</Text>
              </View>
              <Text className='font-rubik-bold text-primary-300 text-lg'>See All</Text>
            </TouchableOpacity>
            <View className='flex flex-row gap-3'>
              <Image className="size-10 rounded-full mt-1" source={{ uri: latestReviewerProfile?.avatar }} />
              <Text className='font-rubik-medium mt-3'>{latestReviewerProfile?.name.split(/[._\-\d]/)[0]}</Text>
            </View>
            <Text className='text-md leading-7 font-rubik text-black-200'>{reviews[0].review}</Text>
            {/* <Text className='text-sm text-black-200 font-rubik-medium'>{getTimePassed(reviews[0].created_at)}</Text> */}
          </View>) 
          : (<View className="flex gap-2 pb-8">
              <View className='flex flex-row gap-2'>
                <Image className='size-5' source={icons.star} />
                <Text className='text-xl font-rubik-bold text-black-300'>0.0 (0 Reviews)</Text>
              </View>
              <Text className='text-sm font-rubik-light text-black-200 text-left w-full'>No Reviews yet</Text>
            </View>)}
        <View className='flex flex-row justify-between border border-gray-200 p-5 -m-5' style={{borderTopLeftRadius: 30, borderTopRightRadius: 30}}>
          <View className='flex gap-1'>
            <Text className='text-xs font-rubik-medium text-black-200' style={{ letterSpacing: 1.5 }}>PRICE</Text>
            <Text className='text-2xl font-rubik-semibold text-primary-300'>$ {property?.price}</Text>
          </View>
          <TouchableOpacity className='flex justify-center items-center bg-primary-300 rounded-full w-[60%] h-12'>
            <Text className='font-rubik-semibold text-white'>Book Now</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  overlayButtonColor : {
    tintColor: 'white'
  },
  carouselImageSize : {
    width: windowWidth, 
    height: windowHeight * 0.66
  },
  facilitiesIconColor :{
    tintColor: '#0061FF'
  },
});
