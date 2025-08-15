import { Alert, FlatList, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState, memo } from 'react';
import * as Animatable from 'react-native-animatable';
import { icons } from '../constants';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';

interface Post {
  $id: string;
  title: string;
  thumbnail: string;
  video: string;
  creator: { username: string; avatar: string };
}

interface TrendingItemProps {
  activeItem: string;
  item: Post;
}

const zoomIn: Animatable.CustomAnimation = {
  0: { transform: [{ scale: 0.9 }] },
  1: { transform: [{ scale: 1.1 }] },
};

const zoomOut: Animatable.CustomAnimation = {
  0: { transform: [{ scale: 1 }] },
  1: { transform: [{ scale: 0.9 }] },
};

const TrendingItem: React.FC<TrendingItemProps> = ({ activeItem, item }) => {
  const [play, setPlay] = useState(false);
  // const [player, setPlayer] = useState<ReturnType<typeof useVideoPlayer> | null>(null);

  const player = useVideoPlayer(item.video, player => {
    player.loop = true;
    player.play();
  });
  
  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });
  
  useEffect(() => {
    if (play) {
      try {
        player.play();
      } catch (error) {
        console.warn(`Error playing video ${item.$id}:`, error);
        Alert.alert('Error', 'Failed to play video');
        setPlay(false);
      }
    } else {
      try {
        player.pause();
      } catch (error) {
        console.warn(`Error pausing video ${item.$id}:`, error);
      }
    }
  }, [play, item.$id, player]);

  // Handle player errors
  useEffect(() => {
    if (!player) return;
    const subscription = player.addListener('statusChange', ({ status, error }) => {
      if (status === 'error' && error) {
        Alert.alert('Error', error.message || 'Trending video failed to load');
        setPlay(false);
      }
    });
    return () => subscription.remove();
  }, [player]);

  // Stop playing when item is no longer active
  useEffect(() => {
    if (activeItem !== item.$id && play && player) {
      try {
        player.pause();
        setPlay(false);
      } catch (error) {
        console.warn(`Error pausing trending video ${item.$id}:`, error);
      }
    }
  }, [activeItem, item.$id, player]);

  // Clean up player on unmount
  // useEffect(() => {
  //   return () => {
  //     if (player && player.status !== 'error') {
  //       try {
  //         player.pause();
  //         player.replace(null);
  //       } catch (error) {
  //         console.warn(`Error cleaning up trending video ${item.$id}:`, error);
  //       }
  //     }
  //   };
  // }, [player, item.$id]);

  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      <View style={{ width: 208, height: 288, marginTop: 12 }}>
        {play && player ? (
          <VideoView
            style={{ width: '100%', height: '100%', borderRadius: 35, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            player={player}
            contentFit="cover"
            allowsFullscreen 
            // allowsPictureInPicture 
            // nativeControls={false}
          />
        ) : (
          <TouchableOpacity
            className="relative flex justify-center items-center"
            activeOpacity={0.7}
            onPress={() => setPlay(true)}
          >
            <ImageBackground
              source={{ uri: item.thumbnail }}
              className="w-52 h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40"
              resizeMode="cover"
            />
            <Image
              source={icons.play}
              className="w-12 h-12 absolute"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </Animatable.View>
  );
};

const Trending: React.FC<{ posts: Post[] }> = ({ posts }) => {
  const [activeItem, setActiveItem] = useState(posts[0]?.$id || '');

  const viewableItemsChange = ({ viewableItems }: { viewableItems: Array<{ key: string }> }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => <TrendingItem activeItem={activeItem} item={item} />}
      onViewableItemsChanged={viewableItemsChange}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      contentOffset={{ x: 170, y: 0 }}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default Trending;