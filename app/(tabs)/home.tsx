import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import SearchInput from '@components/SearchInput';
import Trending from '@components/Trending';
import EmptyState from '@components/EmptyState';
import { getAllPosts, getLatestPosts } from 'lib/appwrite';
import useAppwrite from 'lib/useAppwrite';
import VideoCard from '@components/VideoCard';
import { useGlobalContext } from 'context/GlobalProvider';



const Home = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite(getAllPosts);

  const { data: latestPosts } = useAppwrite(getLatestPosts);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch();
    setRefreshing(false);
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
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className='font-pmedium text-sm text-gray-100'>Welcome back,</Text>
                <Text className='text-2xl font-psemibold text-white'>{user?.username}</Text>
              </View>

              <View className="mt-1 5">
                <Image 
                  source={images.logoSmall}
                  className='w-9 h-10'
                  resizeMode='contain'
                />
              </View>
            </View>
            <SearchInput 
              initialQuery=''
            />

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className='text-gray-100 text-lg font-pregular mb-3'>Latest Videos</Text>

              <Trending 
                posts={latestPosts ?? []}
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState 
            title="No Videos Found"
            subtitle="Be the first to upload a video"
          />
        )}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
          />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
