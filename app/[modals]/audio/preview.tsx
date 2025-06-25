// ---- app/(modals)/audio/preview.tsx ----
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../styles/theme';
import { saveItem } from '../../../utils/storage';

export default function AudioPreview() {
  const { uri, duration: queryDuration, from } = useLocalSearchParams();
  const router = useRouter();
  const soundRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(Number(queryDuration || 0));
  const [isLoaded, setIsLoaded] = useState(false);

  const loadSound = async () => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current.setOnPlaybackStatusUpdate(null);
    }
    const { sound, status } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: false, isLooping: false },
      (status) => {
        if (status.isLoaded) {
          setPosition(Math.floor(status.positionMillis / 1000));
          if (status.didJustFinish && !status.isLooping) {
            setIsPlaying(false);
          }
        }
      }
    );
    soundRef.current = sound;
    setDuration(Math.floor(status.durationMillis / 1000));
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded) {
        setPosition(Math.floor(status.positionMillis / 1000));
        if (status.didJustFinish && !status.isLooping) {
          setIsPlaying(false);
        }
      }
    });
    setIsLoaded(true);
  };

  const togglePlayPause = async () => {
  if (!isLoaded) {
    await loadSound();
  }

  const status = await soundRef.current.getStatusAsync();
  if (!status.isLoaded) return;

  if (status.isPlaying) {
    await soundRef.current.pauseAsync();
    setIsPlaying(false);
  } else {
    if (status.positionMillis === status.durationMillis) {
      await soundRef.current.setPositionAsync(0);
    }
    await soundRef.current.playAsync();
    setIsPlaying(true);
  }
};

  const stopSound = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.setPositionAsync(0);
      setIsPlaying(false);
    }
  };

  const saveAudio = async () => {
    const name = `audio-${Date.now()}.3gp`;
    try {
      const info = await FileSystem.getInfoAsync(uri);
      const size = info.size ? (info.size / 1024).toFixed(1) + ' KB' : 'Unknown';
      const newAudio = { name, uri, duration, size };
      await saveItem('audios', newAudio);
      Alert.alert('Saved', 'Audio saved successfully');
      router.replace('/audio');
    } catch (error) {
      console.error('Failed to save audio:', error);
      Alert.alert('Error', 'Failed to save audio');
    }
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        stopSound();
      };
    }, [])
  );

  useEffect(() => {
    loadSound();
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current.setOnPlaybackStatusUpdate(null);
      }
    };
  }, [uri]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) % 3600 / 60);
    const s = seconds % 60;

    const parts = [];
    if (h > 0) parts.push(`${h} hr`);
    if (m > 0) parts.push(`${m} min`);
    if (s > 0 || parts.length === 0) parts.push(`${s} sec`);

    return parts.join(' ');
  };

  const isNewRecording = from === 'record';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          {isNewRecording ? (
            <Text style={styles.headerTitle}>Audio</Text>
          ) : (
            <>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Your library</Text>
              <View style={{ width: 24 }} />
            </>
          )}
        </View>

        <View style={styles.content}>
          <Ionicons name="mic-circle" size={96} color="#3B82F6" style={{ marginBottom: 20 }} />
          <Text style={styles.generatedText}>{isNewRecording ? 'Audio Generated!' : 'My Audio'}</Text>
          {isNewRecording && <Text style={styles.filename}>audio-preview.mp3</Text>}

          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={duration}
              value={position}
              minimumTrackTintColor="#60A5FA"
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor="#3B82F6"
              disabled
            />
            <View style={styles.timeLabels}>
              <Text style={styles.time}>{formatTime(position)}</Text>
              <Text style={styles.time}>{formatTime(duration)}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.playButton} onPress={togglePlayPause}>
            <Ionicons name={isPlaying ? 'pause' : 'play'} size={28} color="white" />
          </TouchableOpacity>

          {isNewRecording && (
            <TouchableOpacity style={styles.saveButton} onPress={saveAudio}>
              <Text style={styles.saveButtonText}>Save audio</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    flex: 1,
  },
  content: {
    alignItems: 'center',
  },
  generatedText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  filename: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 24,
  },
  sliderContainer: {
    width: '100%',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 10,
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  time: {
    fontSize: 12,
    color: colors.gray,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 24,
  },
  saveButton: {
    width: '100%',
    backgroundColor: '#1D4ED8',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
