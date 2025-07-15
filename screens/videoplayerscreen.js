import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useRoute, useNavigation } from '@react-navigation/native';

// Placeholder for API calls
import { fetchVideoDetails, fetchNCERTConcepts, fetchOtherChannelVideos } from '../api'; // You'll create this file

const VideoPlayerScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { videoId, videoTitle, channelName } = route.params;

  const [playing, setPlaying] = useState(false);
  const [ncertConcepts, setNcertConcepts] = useState([]);
  const [otherVideos, setOtherVideos] = useState([]);
  const playerRef = useRef(null); // Ref for YoutubePlayer

  // For dynamic concept suggestion (Bonus)
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [dynamicallySuggestedConcepts, setDynamicallySuggestedConcepts] = useState([]);
  const conceptFetchIntervalRef = useRef(null); // To clear interval

  useEffect(() => {
    loadVideoData();
    // Setup interval for dynamic concept fetching 
    conceptFetchIntervalRef.current = setInterval(async () => {
      if (playerRef.current && playing) {
        const currentTime = await playerRef.current.getCurrentTime();
        setCurrentPlaybackTime(currentTime);
        // Fetch concepts based on timestamp
        const dynamicConcepts = await fetchNCERTConcepts(videoId, currentTime); // Your backend API
        setDynamicallySuggestedConcepts(dynamicConcepts);
      }
    }, 5000); // Fetch every 5 seconds

    return () => {
      clearInterval(conceptFetchIntervalRef.current); // Clear interval on unmount
    };
  }, [videoId, playing]);

  const loadVideoData = async () => {
    try {
      // Fetch static NCERT concepts (initially for the whole video)
      const concepts = await fetchNCERTConcepts(videoId); // Your backend API [cite: 12, 13]
      setNcertConcepts(concepts);

      // Fetch other videos from the same channel [cite: 21]
      const otherVids = await fetchOtherChannelVideos(channelName); // Assuming you have channelName
      setOtherVideos(otherVids.filter(v => v.id !== videoId)); // Exclude current video
    } catch (error) {
      console.error('Error loading video data:', error);
    }
  };

  const onStateChange = useCallback((state) => {
    if (state === 'ended') {
      setPlaying(false);
      // Optional: handle video end (e.g., play next video)
    } else if (state === 'playing') {
      setPlaying(true);
    } else if (state === 'paused') {
      setPlaying(false);
    }
  }, []);

  const renderNCERTConcept = ({ item }) => (
    <View style={styles.ncertConceptItem}>
      <Text style={styles.ncertConceptTitle}>{item.conceptTitle}</Text>
      <Text style={styles.ncertConceptText}>{item.conceptText}</Text>
      <Text style={styles.ncertReference}>{`NCERT, Grade ${item.grade} ${item.subject}, Chapter ${item.chapter}, Section ${item.section}, p. ${item.page}`}</Text> [cite: 75]
    </View>
  );

  const renderOtherVideo = ({ item }) => (
    <TouchableOpacity
      style={styles.otherVideoItem}
      onPress={() => navigation.push('VideoPlayer', { videoId: item.id, videoTitle: item.title, channelName: item.channelName })}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.otherVideoThumbnail} />
      <View style={styles.otherVideoDetails}>
        <Text style={styles.otherVideoTitle}>{item.title}</Text>
        <Text style={styles.otherVideoChannel}>{item.channelName}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.videoPlayerContainer}>
        <YoutubePlayer
          ref={playerRef}
          height={220}
          play={playing}
          videoId={videoId}
          onChangeState={onStateChange}
        />
        <Text style={styles.videoTitleMain}>{videoTitle}</Text> [cite: 19]
        <Text style={styles.channelNameMain}>{channelName}</Text> [cite: 19]
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Relevant NCERT Concepts</Text> [cite: 20]
        {dynamicallySuggestedConcepts.length > 0 ? (
          <View>
            <Text style={styles.dynamicConceptHeader}>Concepts for current time ({currentPlaybackTime.toFixed(0)}s):</Text>
            <FlatList
              data={dynamicallySuggestedConcepts}
              renderItem={renderNCERTConcept}
              keyExtractor={(item, index) => `dynamic-concept-${index}`}
            />
          </View>
        ) : null}

        {ncertConcepts.length > 0 && (
          <View>
            {dynamicallySuggestedConcepts.length > 0 && <Text style={styles.dynamicConceptHeader}>All relevant concepts:</Text>}
            <FlatList
              data={ncertConcepts}
              renderItem={renderNCERTConcept}
              keyExtractor={(item, index) => `concept-${index}`}
            />
          </View>
        )}
        {ncertConcepts.length === 0 && dynamicallySuggestedConcepts.length === 0 && (
          <Text style={styles.noConceptsText}>No NCERT concepts found for this video yet.</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>More from {channelName}</Text> [cite: 21]
        <FlatList
          data={otherVideos}
          renderItem={renderOtherVideo}
          keyExtractor={(item) => item.id}
          scrollEnabled={false} // Disable inner scroll if within a ScrollView
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  videoPlayerContainer: {
    marginBottom: 15,
  },
  videoTitleMain: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingHorizontal: 15,
    marginTop: 10,
  },
  channelNameMain: {
    fontSize: 16,
    color: '#555',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  section: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  ncertConceptItem: {
    backgroundColor: '#e6f7ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#3399ff',
  },
  ncertConceptTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  ncertConceptText: {
    fontSize: 14,
    lineHeight: 20,
  },
  ncertReference: {
    fontSize: 12,
    color: '#777',
    marginTop: 8,
    fontStyle: 'italic',
  },
  dynamicConceptHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    color: '#007bff',
  },
  noConceptsText: {
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
    paddingVertical: 20,
  },
  otherVideoItem: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  otherVideoThumbnail: {
    width: 100,
    height: 60,
    borderRadius: 6,
    marginRight: 10,
  },
  otherVideoDetails: {
    flex: 1,
  },
  otherVideoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  otherVideoChannel: {
    fontSize: 12,
    color: '#666',
  },
});

export default VideoPlayerScreen;