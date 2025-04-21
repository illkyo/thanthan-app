import { View, Text, TouchableOpacity } from 'react-native'

export default function NumberSelect({ max, selected = 0, onNumberPress }: { max: number; selected?: number, onNumberPress: (value: number) => void; }) {
  function handleNumberPress(number: number) {
    onNumberPress(number);
  }

  return (
    <View className='flex-row gap-2'>
      {Array.from({ length: max }).map((_, i) => (
        <TouchableOpacity className='flex justify-center items-center' key={i} onPress={() => handleNumberPress(i)}>
          <Text className='font-rubik-medium'>{i}</Text>
          <View className='size-5 rounded-full border border-primary-300 flex justify-center items-center'>
            {selected === i ?
              <View className='size-2 rounded-full bg-primary-300'></View>
              : null}
          </View>
        </TouchableOpacity>))}
    </View>
  )}
