import { Alert, Button, FlatList, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Animatable from 'react-native-animatable'
import { icons } from '../constants';
import { useVideoPlayer, VideoPlayer, VideoView, StatusChangeEventPayload } from 'expo-video';
import { useEvent, useEventListener } from 'expo';

const zoomIn: Animatable.CustomAnimation = {
  0: { transform: [{ scale: 0.9 }] },
  1: { transform: [{ scale: 1.1 }] },
};

const zoomOut: Animatable.CustomAnimation = {
  0: { transform: [{ scale: 1 }] },
  1: { transform: [{ scale: 0.9 }] },
};



const TrendingItem: React.FC<TrendingItemProps> = ({ activeItem, item }) => {
  // const videoSource = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  // const player: VideoPlayer = useVideoPlayer(videoSource, (player: VideoPlayer) => {
  //   player.loop = true;
  //   // player.play();
  // });

  // const { isPlaying }: { isPlaying: boolean } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  const [play, setPlay] = useState(false);
  const player: VideoPlayer = useVideoPlayer(play ?  item.video: null, (player: VideoPlayer) => {
    if (play) {
      player.play();
    }
  });

  useEventListener(player, 'statusChange', ({ status, error }: StatusChangeEventPayload) => {
    if (status === 'idle') {
      setPlay(false);
      player.pause();
      if (error) {
        Alert.alert('Error', (error as Error).message);
      }
    }
  });

  // Stop playing when item is no longer active
  useEffect(() => {
    if (activeItem !== item.$id && play) {
      setPlay(false);
      player?.pause();
    }
  }, [activeItem, item.$id]);
  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      <View style={{ width: 208, height: 288, marginTop: 12 }}>
        {play ? (
          <VideoView 
            style={{ width: '100%', height: '100%', borderRadius: 35, backgroundColor: 'rgba(255, 255, 255, 0.1' }}
            player={player}
            contentFit='cover'
            nativeControls={false}
            // onEnd={() => {
            //   setPlay(false);
            //   player?.pause();
            // }}
          />
        ) : (
          <TouchableOpacity
            className="relative flex justify-center items-center"
            activeOpacity={0.7}
            onPress={() => setPlay(true)}
          >
            <ImageBackground
              source={{
                uri: item.thumbnail,
              }}
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

const Trending = ({ posts }: { posts: Post[] }) => {
  const [activeItem, setActiveItem] = useState(posts[0]?.$id || "")

  const viewableItemsChange = ({ viewableItems }: { viewableItems: Array<{ key: string }> }) => {
    if(viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  }
  return (
    <FlatList 
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
          <TrendingItem activeItem={activeItem} item={item} />
          // <VideoScreen />
      )}
      onViewableItemsChanged={viewableItemsChange}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70
      }}
      contentOffset={{ x: 170, y: 0 }}
      horizontal
    />
  )
}

export default Trending;