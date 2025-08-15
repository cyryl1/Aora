import { View, Text, FlatList, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import VideoCard from '@components/VideoCard';
import Video from '@components/Video';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Video {
  $id: string;
  title: string;
  thumbnail: string;
  video: string;
  creator: { username: string; avatar: string };
}

const BookmarkTab: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load bookmarks from AsyncStorage
  const loadBookmarks = async () => {
    setIsLoading(true);
    try {
      const bookmarksData = await AsyncStorage.getItem('bookmarks');
      const bookmarkList = bookmarksData ? JSON.parse(bookmarksData) : [];
      setBookmarks(bookmarkList);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh bookmarks when tab is focused
  useFocusEffect(
    React.useCallback(() => {
      loadBookmarks();
      return () => {};
    }, [])
  );

  return (
    <SafeAreaView className='bg-primary h-full'>
      <View className="flex-1 p-8">
        <Text className="text-white text-2xl font-bold mb-4">Bookmarked Videos</Text>
        {isLoading ? (
          <Text className="text-gray-100 text-center mt-10">Loading bookmarks...</Text>
        ) : bookmarks.length === 0 ? (
          <Text className="text-gray-100 text-center mt-10">No bookmarked videos yet!</Text>
        ) : (
          <FlatList
            data={bookmarks}
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => <Video item={item} />}
            showsVerticalScrollIndicator={false}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={5}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default BookmarkTab;