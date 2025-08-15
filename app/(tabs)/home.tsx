import { View, Text, FlatList, Image, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import SearchInput from '@components/SearchInput';
import Trending from '@components/Trending';
import EmptyState from '@components/EmptyState';
import { getAllPosts, getLatestPosts } from 'lib/appwrite';
import useAppwrite from 'lib/useAppwrite';
import VideoCard from '@components/VideoCard';
import Video from '@components/Video';
import { useGlobalContext } from 'context/GlobalProvider';

interface Post {
  $id: string;
  title: string;
  thumbnail: string;
  video: string;
  creator: { username: string; avatar: string };
}

const Home = () => {
  const { user } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite(getAllPosts);
  const { data: latestPosts } = useAppwrite(getLatestPosts);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useEffect(() => {
    if (posts) setIsLoading(false);
  }, [posts]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts ?? []}
        keyExtractor={(item: Post) => item.$id}
        // renderItem={({ item }) => <VideoCard video={item} />}
        renderItem={({ item }) => <Video item={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">Welcome back,</Text>
                <Text className="text-2xl font-psemibold text-white">{user?.username}</Text>
              </View>
              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>
            <SearchInput initialQuery="" />
            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-gray-100 text-lg font-pregular mb-3">Latest Videos</Text>
              <Trending posts={latestPosts ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() =>
          isLoading ? (
            <Text className="text-gray-100 text-center mt-10">Loading videos...</Text>
          ) : (
            <EmptyState title="No Videos Found" subtitle="Be the first to upload a video" />
          )
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        windowSize={3}
      />
    </SafeAreaView>
  );
};

export default Home;