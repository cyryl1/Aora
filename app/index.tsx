// eslint-disable-next-line import/order
import CustomButton from '@components/CustomButton';
import { Redirect, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import '../global.css';
import { SafeAreaView } from 'react-native-safe-area-context';

import { images } from '../constants';
export default function App() {
  return (
    <SafeAreaView className="h-full bg-primary">
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="min-h-[85vh] w-full items-center px-4">
          <Image
            source={images.logo}
            // className='w-[130px] h-[84px]'
            resizeMode="contain"
            style={{ width: 130, height: 84 }}
          />
          <Image
            source={images.cards}
            // className='max-w-[300px] w-full h-[300px]'
            resizeMode="contain"
            style={{ maxWidth: 380, width: '100%', height: 300 }}
          />

          <View className="relative mt-5">
            <Text className="text-center text-5xl font-bold text-white">
              Discover Endless Possibilities with <Text className="text-secondary-200">Aora</Text>
            </Text>
            <Image
              source={images.path}
              style={{ width: 136, height: 15, position: 'absolute', bottom: -8, right: -8 }}
              // className="w-[136px] h-[15px] absolute -bottom-2 -right-2"
              resizeMode="contain"
            />
          </View>
          <Text className="mt-7 text-center font-pregular text-sm text-gray-100">
            Where creativity meets innovation: embark on a journey of limitless exploration and
            inspiration with Aora.
          </Text>

          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push('/sign-in')}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}
