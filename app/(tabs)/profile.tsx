import React from 'react';
import { View, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmptyState from '@components/EmptyState';
import { getUserPosts, signOut } from 'lib/appwrite';
import useAppwrite from 'lib/useAppwrite';
import VideoCard from '@components/VideoCard';
import { useGlobalContext } from 'context/GlobalProvider';
import { icons } from '../../constants';
import InfoBox from '@components/InfoBox';

import { router } from 'expo-router';

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const { data: posts } = useAppwrite(
    () => getUserPosts(user.$id)
  );

  const logOut = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);

    router.replace('/sign-in');
  }


  // console.log(posts)

  return (
    <SafeAreaView className='bg-primary h-full'>
      <FlatList<Post>
        data={posts ?? []}
        keyExtractor={(item) => String(item.$id)}
        renderItem={({ item }) => (
          <VideoCard 
            video={item}
          />
        )}
        ListHeaderComponent={() => (
          <View className='w-full justify-center items-center mt-6 mb-12 px-4'>
            <TouchableOpacity
              className='w-full items-end mb-10'
              onPress={logOut}
            >
              <Image 
                source={icons.logout}
                resizeMode='contain'
                className='w-6 h-6'
              />
            </TouchableOpacity>
            <View className='w-16 h-16 border border-secondary rounded-lg justify-center items-center'>
              <Image 
                source={{ uri: user?.avatar }}
                className='w-[90%] h-[90%] rounded-lg'
                resizeMode="cover"
              />
            </View>
            <InfoBox 
               title={user?.username}
               subtitle=''
               containerStyles='mt-5'
               titleStyles="text-lg"
            />

            <View className='mt-5 flex-row'>
              <InfoBox 
                title={posts.length || 0}
                subtitle="Posts"
                containerStyles="mr-10"
                titleStyles="text-xl"
              />
              <InfoBox 
                title="1.3k"
                subtitle="Followers"
                containerStyles=''
                titleStyles="text-xl"
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState 
            title="No Videos Found"
            subtitle="No videos found for this query"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Profile;
