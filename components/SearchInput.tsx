import React, { useState } from 'react';
import { View, Text, TextInput, Touchable, TouchableOpacity, Image, Alert } from 'react-native';
import { icons } from '../constants';
import { router, usePathname } from 'expo-router';


const SearchInput = ({ initialQuery }: SearchInputProps) => {
  const pathname = usePathname();

  const [query, setQuery] = useState(initialQuery || '')

  return (
    <View className='border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row space-x-4'>
        <TextInput 
            className='flex-1 text-white font-pregular text-base'
            value={query}
            placeholder='Search for video topic'
            placeholderTextColor="#CDCDE0"
            onChangeText={(e) => setQuery(e)}
        />

        <TouchableOpacity
          onPress={() => {
            if(!query) {
              return Alert.alert('Missing query', "Please input something to search results across database")
            }

            if (pathname.startsWith('/search')) {
              router.setParams({ query })
            } else {
              router.push(`/search/${query}`)
            }
          }}
        >
            <Image
                source={icons.search}
                className='w-5 h-5'
                resizeMode='contain'
            />
        </TouchableOpacity>
    </View>
  );
}

export default SearchInput