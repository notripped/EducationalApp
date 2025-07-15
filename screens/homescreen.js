import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { fetchRandomVideos, fetchChannelVideos } from '../api';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const [randomVideos, setRandomVideos] = useState([]);
  const [channels, setChannels] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const flatListRandomRef = useRef(null);
  const scrollIndex = useRef(0);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (randomVideos.length > 0) {
      const interval = setInterval(() => {
        scrollIndex.current = (scrollIndex.current + 1) % randomVideos.length;
        if (flatListRandomRef.current) {
          flatListRandomRef.current.scrollToIndex({
            index: scrollIndex.current,
            animated: true,
          });
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [randomVideos]);

  const loadData = async () => {
    setRefreshing(true);
    try {
      const random = await fetchRandomVideos();
      console.log('DEBUG: Fetched random videos:', JSON.stringify(random, null, 2)); // ADD THIS LINE
      setRandomVideos(random);

      const channel1Videos = await fetchChannelVideos('UCRJO5GzE_k-0B_H_C3C_o7w');
      console.log('DEBUG: Fetched channel1Videos:', JSON.stringify(channel1Videos, null, 2)); // ADD THIS LINE
      const channel2Videos = await fetchChannelVideos('UCsXVk37bltHxD1rDPwtNM8Q');
      console.log('DEBUG: Fetched channel2Videos:', JSON.stringify(channel2Videos, null, 2)); // ADD THIS LINE

      setChannels([
        { name: 'Veritasium', id: 'UCRJO5GzE_k-0B_H_C3C_o7w', videos: channel1Videos },
        { name: 'Kurzgesagt – In a Nutshell', id: 'UCsXVk37bltHxD1rDPwtNM8Q', videos: channel2Videos },
      ]);
      console.log('DEBUG: Final channels state:', JSON.stringify(channels, null, 2)); // ADD THIS LINE (Note: This will log the *previous* state due to closure, but still useful for structure)

    } catch (error) {
      console.error('Error loading home screen data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderVideoThumbnail = useCallback(({ item }) => {
    console.log('DEBUG: Rendering video thumbnail for item:', JSON.stringify(item, null, 2)); // ADD THIS LINE
    // Ensure all properties are present and are strings before rendering
    if (!item || typeof item.id !== 'string' || typeof item.title !== 'string' || typeof item.thumbnail !== 'string' || typeof item.channelName !== 'string') {
        console.error('DEBUG: Malformed video item encountered:', item);
        return null; // Or render a placeholder/error item
    }

    return (
      <TouchableOpacity
        style={styles.videoThumbnail}
        onPress={() => navigation.navigate('VideoPlayer', { videoId: item.id, videoTitle: item.title, channelName: item.channelName })}
      >
        <Image source={{ uri: item.thumbnail }} style={styles.thumbnailImage} />
        <Text style={styles.videoTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.channelName}>{item.channelName}</Text>
      </TouchableOpacity>
    );
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        data={[{ type: 'random', data: randomVideos }, ...channels.map(c => ({ type: 'channel', data: c }))]}
        keyExtractor={(item, index) => {
            // Defensive keyExtractor: ensure ID exists
            if (item.type === 'random') return 'random-videos';
            if (item.data && item.data.id) return `channel-${item.data.id}-${index}`;
            console.warn('DEBUG: Missing ID for channel item:', item);
            return `channel-no-id-${index}`; // Fallback key
        }}
        renderItem={({ item }) => {
          console.log('DEBUG: Main FlatList rendering item type:', item.type, JSON.stringify(item, null, 2)); // ADD THIS LINE
          if (item.type === 'random') {
            return (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Explore</Text>
                <FlatList
                  ref={flatListRandomRef}
                  data={item.data}
                  renderItem={renderVideoThumbnail}
                  keyExtractor={(video) => {
                      // Defensive keyExtractor for nested FlatList
                      if (video && video.id) return video.id;
                      console.warn('DEBUG: Missing ID for random video:', video);
                      return `random-video-no-id-${Math.random()}`; // Fallback key
                  }}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  getItemLayout={(data, index) => ({
                    length: 190,
                    offset: 190 * index,
                    index,
                  })}
                  initialScrollIndex={0}
                />
              </View>
            );
          } else if (item.type === 'channel') {
            return (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>{item.data?.name || 'Unknown Channel'}</Text> {/* Added nullish coalescing */}
                <FlatList
                  data={item.data?.videos?.slice(0, 10) || []} // Added optional chaining and fallback
                  renderItem={renderVideoThumbnail}
                  keyExtractor={(video) => {
                      // Defensive keyExtractor for nested FlatList
                      if (video && video.id) return video.id;
                      console.warn('DEBUG: Missing ID for channel video:', video);
                      return `channel-video-no-id-${Math.random()}`; // Fallback key
                  }}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            );
          }
          return null;
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadData} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingTop: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 10,
  },
  videoThumbnail: {
    width: 180,
    marginHorizontal: 10,
  },
  thumbnailImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
    maxHeight: 40,
  },
  channelName: {
    fontSize: 12,
    color: '#666',
  },
});

export default HomeScreen;