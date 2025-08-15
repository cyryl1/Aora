import { View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import React, { useEffect, useState, memo } from 'react';
import { useVideoPlayer, VideoView } from 'expo-video';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { icons } from '../constants';

interface VideoCardProps {
  video: {
    $id: string;
    title: string;
    thumbnail: string;
    video: string;
    creator: { username: string; avatar: string };
  };
}

const VideoCard: React.FC<VideoCardProps> = ({
  video: { $id, title, thumbnail, video, creator: { username, avatar } },
}) => {
  const [play, setPlay] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [player, setPlayer] = useState<ReturnType<typeof useVideoPlayer> | null>(null);


  // Initialize player only when playing
  useEffect(() => {
    if (play && !player) {
      // const newPlayer = useVideoPlayer(video, (p) => {
      const newPlayer = useVideoPlayer(video, (p) => {
        p.loop = true;
        try {
          p.play();
        } catch (error) {
          console.warn(`Error playing video ${$id}:`, error);
        }
      });
      setPlayer(newPlayer);
    }
  }, [play, video, $id]);

  // Check bookmark status
  useEffect(() => {
    const checkBookmark = async () => {
      try {
        const bookmarks = await AsyncStorage.getItem('bookmarks');
        const bookmarkList = bookmarks ? JSON.parse(bookmarks) : [];
        setIsBookmarked(bookmarkList.some((item: VideoCardProps['video']) => item.$id === $id));
      } catch (error) {
        console.error('Error checking bookmark:', error);
      }
    };
    checkBookmark();
  }, [$id]);

  // Handle player errors
  useEffect(() => {
    if (!player) return;
    const subscription = player.addListener('statusChange', ({ status, error }) => {
      if (status === 'error' && error) {
        Alert.alert('Error', error.message || 'Video failed to load');
        setPlay(false);
        setPlayer(null);
      }
    });
    return () => subscription.remove();
  }, [player]);

  // Pause player when tab loses focus
  useFocusEffect(
    React.useCallback(() => {
      console.log(`useFocusEffect called for video ${$id}`);
      return () => {
        if (player && player.playing) {
          try {
            player.pause();
            setPlay(false);
          } catch (error) {
            console.warn(`Error pausing video ${$id}:`, error);
          }
        }
      };
    }, [player, $id])
  );

  // Clean up player on unmount
  useEffect(() => {
    return () => {
      if (player && player.status !== 'error') {
        try {
          player.pause();
          player.replace(null);
          setPlayer(null);
        } catch (error) {
          console.warn(`Error cleaning up video ${$id}:`, error);
        }
      }
    };
  }, [player, $id]);

  // Toggle bookmark
  const toggleBookmark = async () => {
    try {
      const bookmarks = await AsyncStorage.getItem('bookmarks');
      let bookmarkList = bookmarks ? JSON.parse(bookmarks) : [];

      if (isBookmarked) {
        bookmarkList = bookmarkList.filter((item: VideoCardProps['video']) => item.$id !== $id);
      } else {
        bookmarkList.push({ $id, title, thumbnail, video, creator: { username, avatar } });
      }

      await AsyncStorage.setItem('bookmarks', JSON.stringify(bookmarkList));
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      Alert.alert('Error', 'Failed to update bookmark');
    }
  };

  return (
    <View className="flex-col items-center px-4 mb-14">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
            <Image source={{ uri: avatar }} className="w-full h-full rounded-lg" resizeMode="cover" />
          </View>
          <View className="justify-center flex-1 ml-3 gap-y-1">
            <Text className="text-white font-psemibold text-sm" numberOfLines={1}>
              {title}
            </Text>
            <Text className="text-xs text-gray-100 font-pregular" numberOfLines={1}>
              {username}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={toggleBookmark} className="pt-2">
          <Image
            source={icons.bookmark}
            className="w-5 h-5"
            resizeMode="contain"
            tintColor={isBookmarked ? '#FFA500' : '#FFFFFF'}
          />
        </TouchableOpacity>
      </View>
      {play && player ? (
        <VideoView
          className="w-full h-60 rounded-xl mt-3"
          player={player}
          allowsFullscreen
          allowsPictureInPicture
          contentFit="contain"
          nativeControls
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
        >
          <Image source={{ uri: thumbnail }} className="w-full h-full rounded-xl" resizeMode="cover" />
          <Image source={icons.play} className="w-12 h-12 absolute" resizeMode="contain" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default memo(VideoCard);