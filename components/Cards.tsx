import { View, Text, TouchableOpacity, Image } from 'react-native'
import images from '@/constants/images';
import icons from '@/constants/icons';
import { Property } from '@/lib/data-types';

interface Props {
  item: Property;
  onPress?: () => void;
}

export function FeaturedCard({ item: { name, address, price, image, rating }, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} className='flex flex-col items-start w-60 h-80 relative'>
      <Image className='size-full rounded-2xl' source={{ uri: image }}/>
      <Image className='size-full rounded-2xl absolute bottom-0' source={images.cardGradient}/>
      <View className='flex flex-row items-center bg-white/90 px-3 py-1.5 rounded-full absolute top-5 right-5'>
        <Image className='size-3.5' source={icons.star} />
        <Text className='text-xs font-rubik-bold text-primary-300 ml-1'>{rating}</Text>
      </View>
      <View className='flex flex-col items-start absolute bottom-5 inset-x-5'>
        <Text className='text-xl font-rubik-extrabold text-white' numberOfLines={1}>{name}</Text>
        <Text className='text-base font-rubik text-white'>{address}</Text>
        <View className='flex flex-row items-center justify-between w-full'>
          <Text className='text-xl font-rubik-extrabold text-white'>
          {`$ ${price}`}
          </Text>
          <Image className='size-5' source={icons.heart} />
        </View>
      </View>
    </TouchableOpacity>
  )};

export function Card({ item: { name, address, price, image, rating }, onPress }: Props) {
  return (
    <TouchableOpacity className='flex-1 w-full px-3 py-4 rounded-lg bg-white shadow-lg shadow-black-100/70 relative' style={{ elevation: 5 }} onPress={onPress}>
      <View className='flex flex-row items-center absolute px-2 top-5 right-5 bg-white/90 p-1 rounded z-50'>
        <Image className='size-2.5' source={icons.star} />
        <Text className='text-xs font-rubik-bold text-primary-300 ml-0.5'>{rating}</Text>
      </View>
      <Image className='w-full h-40 rounded-lg' source={{ uri: image }}/>
      <View className='flex flex-col mt-2'>
        <Text className='text-xl font-rubik-bold text-black-300'>{name}</Text>
        <Text className='text-xs font-rubik text-black-200'>{address}</Text>
        <View className='flex flex-row items-center justify-between mt-2'>
          <Text className='text-base font-rubik-bold text-primary-300'>
            {`$ ${price}`}
          </Text>
          <Image className='w-5 h-5 mr-2' tintColor='#191d31' source={icons.heart} />
        </View>
      </View>
    </TouchableOpacity>
  )};