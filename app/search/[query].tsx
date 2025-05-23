import React, { useEffect } from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchInput from '@components/SearchInput';
import EmptyState from '@components/EmptyState';
import { searchPosts } from 'lib/appwrite';
import useAppwrite from 'lib/useAppwrite';
import VideoCard from '@components/VideoCard';
import { useLocalSearchParams } from 'expo-router';



const Search = () => {
  const { query } = useLocalSearchParams<{ query: string }>();
  const { data: posts, refetch } = useAppwrite(
    () => searchPosts(query)
  );

  useEffect(() => {
    refetch()
  }, [query])

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
          <View className="my-6 px-4">
            <Text className='font-pmedium text-sm text-gray-100'>
              Search results
            </Text>
            <Text className='text-2xl font-psemibold text-white'>
              {query}
            </Text>
            <View className="mt-6 mb-8">
              <SearchInput initialQuery={query} />
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

export default Search;
