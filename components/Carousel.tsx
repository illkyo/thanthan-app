import { View, TouchableOpacity, FlatList, Image, StyleSheet, Dimensions } from 'react-native';
import { useRef, useState } from 'react';
import type { FlatList as FlatListType, ImageStyle, StyleProp } from 'react-native';

const { width: windowWidth } = Dimensions.get('window');

interface CarouselProps {
  data: string[];
  size: StyleProp<ImageStyle>
}

export default function Carousel({ data, size }: CarouselProps) {
  const flatListRef = useRef<FlatListType<string>>(null);
  const [currentCarouselImage, setCurrentCarouselImage] = useState(0);

  function scrolltoCarouselImage(index: number) {
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

   return (
      <View>
        <FlatList horizontal
          ref={flatListRef}
          data={data}
          renderItem={({ item }) => <Image source={{uri: item}} style={size} resizeMode="cover"/>}
          keyExtractor={(_, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onMomentumScrollEnd={(event) => {
            const offsetX = event.nativeEvent.contentOffset.x;
            const index = Math.round(offsetX / windowWidth);
            setCurrentCarouselImage(index);
          }}
          />
        <View className='absolute bottom-4 left-0 right-0 flex flex-row items-center justify-center gap-2'>
          {/* <TouchableOpacity className='bg-primary-300 rounded-full w-10 h-2'></TouchableOpacity> */}
          {data.map((_, index) => <TouchableOpacity key={index} className={`rounded-full size-2 ${currentCarouselImage === index ? 'bg-primary-300' : 'bg-white'}`} onPress={() => scrolltoCarouselImage(index)}></TouchableOpacity>)}
        </View>
      </View>
   )
};