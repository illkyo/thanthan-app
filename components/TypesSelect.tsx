import { View, Text, TouchableOpacity } from 'react-native';

export default function TypesSelect({ typesArray, max, selected = [], onTypePress }: { typesArray: string[], max: number, selected?: string[], onTypePress: (selectedTypesArray: string[]) => void }) {
  function handleTypePress(type: string) {
    let updatedTypes;
    if (selected.includes(type)) {
      updatedTypes = selected.filter((t) => t !== type);
    } else if (selected.length < max) {
      updatedTypes = [...selected, type];
    } else {
      console.log('Max number of types reached');
      return;
    }
    onTypePress(updatedTypes);
  };

  return (
    <View className='flex flex-row gap-3 flex-wrap'>
      {typesArray.map((item, index) => (
        <TouchableOpacity key={index} className={`rounded-full px-4 py-2 ${selected.includes(item) ? 'bg-primary-300' : 'bg-primary-100 border border-primary-200'}`} onPress={() => handleTypePress(item)}>
          <Text className={`text-base ${selected.includes(item) ? 'text-white font-rubik-bold' : 'text-black-300 font-rubik'}`}>{item}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity onPress={() => console.log(selected)}>
        <Text>Check Selected Types</Text>
      </TouchableOpacity>
    </View>
  )}