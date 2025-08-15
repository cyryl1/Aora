import FormField from '@components/FormField';
import { icons } from '../../constants';
import { useVideoPlayer, VideoPlayer, VideoView } from 'expo-video';
import React, { useState } from 'react';
import { Alert, Image, TouchableOpacity } from 'react-native';
import { Text, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@components/CustomButton';
// import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { createVideo } from 'lib/appwrite';
import { useGlobalContext } from 'context/GlobalProvider';


const Create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState<{
    title: string;
    video: any | null;
    thumbnail: { uri: string } | null;
    prompt: string;
  }>({
    title: '',
    video: null,
    thumbnail: null,
    prompt: ''
  });

  const openPicker = async (selectType: string) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      aspect: [4, 3],
      quality: 1,
    });

    if(!result.canceled) {
      if(selectType === 'image') {
        setForm({ ...form, thumbnail: result.assets[0] })
      }

      if(selectType === 'video') {
        setForm({ ...form, video: result.assets[0] }) //Confirm in case of error, if i need to add .uri or not
      }
      
    }

  }

  const submit = async () => {
    if(!form.title || !form.thumbnail || !form.video || !form.prompt) {
      return Alert.alert('Please fill in all the fields')
    }

    if (!user || !user.$id) {
      return Alert.alert('Error', 'User not logged in. Please sign in first.');
    }

    setUploading(true)

    try {
      await createVideo({
        ...form,
        userId: user.$id
      })

      Alert.alert('Success', 'Post uploaded successfully')

      router.push('/home')
    } catch (error) {
      Alert.alert('Error', (error as Error).message)
    } finally {
      setForm({
        title: '',
        video: '',
        thumbnail: null,
        prompt: ''
      });

      setUploading(false);
    }
  }

  const videoSource = form.video;
  const player: VideoPlayer = useVideoPlayer(videoSource, (player: VideoPlayer) => {
    player.loop = true;
    player.play();
  });
  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView className='px-4 my-6'>
        <Text className='text-2xl text-white font-psemibold'>
          Upload Video
        </Text>

        <FormField 
          title="Video Title"
          value={form.title}
          placeholder='Give your video a catch title...'
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles='mt-10'
          keyboardType=''
        />

        <View className="mt-7 space-y-2">
          <Text className='text-base text-gray-100 ffont-pmedium'>
            Upload Video
          </Text>
          <TouchableOpacity onPress={() => openPicker('video')}>
            {form.video ? (
              <VideoView
                style={{ width: 400, height: 240, marginTop: 12 }}
                player={player}
                className='w-full h-64 rounded-2xl'
                allowsFullscreen
                allowsPictureInPicture
                contentFit='cover'
              />
            ) : (
              <View className='w-full h-40 px-4 bg-black rounded-2xl justify-center items-center'>
                <View className='w-14 h-14 border border-dashed border-secondary-100 justify-center items-center'>
                  <Image 
                    source={icons.upload}
                    resizeMode='contain'
                    className='w-1/2 h-1/2'
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className='mt-7 space-y-2'>
          <Text className='text-base text-gray-100 font-pmedium'>
            Thumnail Image
          </Text>

          <TouchableOpacity onPress={() => openPicker('image')}>
            {form.thumbnail ? (
              <Image 
                source={{ uri: form.thumbnail.uri }}
                resizeMode='cover'
                className='w-full h-64 rounded-2xl'
              />
            ) : (
              <View className='w-full h-16 px-4 bg-black rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2'>
                <Image 
                  source={icons.upload}
                  resizeMode='contain'
                  className='w-5 h-5'
                />
                <Text className='text-ssm text-gray-100 font-pmedium'>
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <FormField 
          title="AI Prompt"
          value={form.prompt}
          placeholder='The prompt you used to create this video'
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
          otherStyles='mt-7'
          keyboardType=''
        />
        <CustomButton 
          title='Submit & Publish'
          handlePress={submit}
          containerStyles='mt-7'
          isLoading={uploading || !user}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
