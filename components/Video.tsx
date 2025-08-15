import { View, Button, StyleSheet, Image, TouchableOpacity, Alert, Text } from 'react-native';
import React, { memo, useState, useEffect } from 'react';
import { useVideoPlayer, VideoView } from 'expo-video';
import { icons } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useEvent } from 'expo';


interface VideoProps {
  item: {
    $id: string;
    title: string;
    thumbnail: string;
    video: string;
    creator: { username: string; avatar: string };
  };
}

const videoSource =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

const Video: React.FC<VideoProps> = ({ item: { $id, title, thumbnail, video, creator: { username, avatar } } }) => {
  const [play, setPlay] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const player = useVideoPlayer(video, player => {
    player.loop = true;
    player.play();
  });

  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  useEffect(() => {
    if (play) {
      try {
        player.play();
      } catch (error) {
        console.warn(`Error playing video ${$id}:`, error);
        Alert.alert('Error', 'Failed to play video');
        setPlay(false);
      }
    } else {
      try {
        player.pause();
      } catch (error) {
        console.warn(`Error pausing video ${$id}:`, error);
      }
    }
  }, [play, $id, player]);


  const toggleBookmark = async () => {
    try {
        const bookmarks = await AsyncStorage.getItem('bookmarks');
        let bookmarkList = bookmarks ? JSON.parse(bookmarks) : [];
  
        if (isBookmarked) {
          bookmarkList = bookmarkList.filter((item: VideoProps['item']) => item.$id !== $id);
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
      {play ? (
        <View className="relative" style={{ width: 400, height: 240, marginTop: 12 }}>
          <VideoView 
            className="w-full h-60 rounded-xl mt-3"
            style={styles.video}
            player={player} 
            allowsFullscreen 
            allowsPictureInPicture 
          />
        </View>
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
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 50,
  },
  video: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    marginTop: 12,
  },
  controlsContainer: {
    padding: 10,
  },
});

export default Video


