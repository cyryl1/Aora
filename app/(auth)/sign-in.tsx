import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { images } from '../../constants';
import FormField from '@components/FormField';
import CustomButton from '@components/CustomButton';
import { Link, router } from 'expo-router';
import { getCurrentUser, signIn } from 'lib/appwrite';
import { useGlobalContext } from 'context/GlobalProvider';

const SignIn = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const { setUser, setIsLoggedIn } = useGlobalContext();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (form.email === "" || form.password === "") {
          Alert.alert('Error', 'Please fill in all fields');
        }
    
        setIsSubmitting(true);
    
        try {
          await signIn(form.email, form.password);

          const result = await getCurrentUser();
          setUser(result);
          setIsLoggedIn(true);
    
          Alert.alert("Success", "User signed in successfully");
    
          //set to global state
    
          router.replace('/home')
        } catch (error) {
          Alert.alert('Error', (error as Error).message);
        } finally {
          setIsSubmitting(false);
        }
  }

  return (
    <SafeAreaView className="h-full bg-primary">
      <ScrollView>
        <View className="my-6 min-h-[83vh] w-full justify-center px-4" >
          <Image source={images.logo} resizeMode="contain" className="h-[35px] w-[115px]" />
          <Text className="text-semibold text-2xl text-white mt-10 font-psemibold">Log in to Aora</Text>

          <FormField 
            title="Email"
            value={form.email}
            handleChangeText={(e: any) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address" 
            placeholder={''}
          />

          <FormField 
            title="Password"
            value={form.password}
            handleChangeText={(e: any) => setForm({ ...form, password: e })}
            otherStyles="mt-7" 
            placeholder={''} 
            keyboardType={''}
          />

          <CustomButton 
            title='Sign In'
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className='text-lg text-gray-100 font-pregular'>
              Don't have account?
            </Text>
            <Link href="/sign-up" className='text-lg font-psemibold text-secondary'>Sign Up</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
