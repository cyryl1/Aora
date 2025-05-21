import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Image } from 'react-native';
import { icons } from '../constants';
import { StatusChangeEventPayload, useVideoPlayer, VideoPlayer, VideoView } from 'expo-video';
import { useEvent, useEventListener } from 'expo';

// Remember to handle Bookamrk... The plan was to change the menu to bookamrk, then it changes color if clicked on....


const VideoCard: React.FC<VideoCardProps>  = ({ video: {title, thumbnail, video, creator: { username, avatar }} }) => {
    // const [play, setPlay] = useState(false);

    // const videoSource = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    // const player: VideoPlayer = useVideoPlayer(videoSource, (player: VideoPlayer) => {
    // player.loop = true;
    // // player.play();
    // });

    // const { isPlaying }: { isPlaying: boolean } = useEvent(player, 'playingChange', { isPlaying: player.playing });

    const [play, setPlay] = useState(false);
      const player: VideoPlayer = useVideoPlayer(play ?  video: null, (player: VideoPlayer) => {
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
        return () => {
            if (play) {
                setPlay(false);
                player?.pause();
            }
        }
      }, [play]);

  return (
    <View className='flex-col items-center px-4 mb-14'>
      <View className='flex-row gap-3 items-start'>
        <View className="justify-center items-center flex-row flex-1">
            <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
                <Image 
                    source={{ uri: avatar }}
                    className='w-full h-full rounded-lg'
                    resizeMode='cover'
                />
            </View>

            <View className='justify-center flex-1 ml-3 gap-y-1'>
                <Text className='text-white font-psemibold text-sm' numberOfLines={1}>
                    {title}
                </Text>
                <Text className='text-xs text-gray-100 font-pregular' numberOfLines={1}>
                    {username}
                </Text>
            </View>
        </View>
        <View className='pt-2'>
          <Image 
            source={icons.bookmark}
            className='w-5 h-5'
            resizeMode='contain'
          />
        </View>
      </View>
      {play ? (
            <VideoView 
                className='w-full h-60 rounded-xl mt-3' 
                player={player} 
                allowsFullscreen 
                allowsPictureInPicture 
                contentFit='contain'
            />
        ) : (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
                if (play) {
                    player.pause();
                    setPlay(false);
                } else {
                    player.play();
                    setPlay(true);
                }
            }}
            className='w-full h-60 rounded-xl mt-3 relative justify-center items-center'
        >
            <Image
                source={{ uri: thumbnail }}
                className='w-full h-full rounded-xl mt-3'
                resizeMode='cover'
            />

            <Image 
                source={icons.play}
                className='w-12 h-12 absolute'
                resizeMode='contain'
            />
        </TouchableOpacity>
      )}
    </View>
  )
}

export default VideoCard