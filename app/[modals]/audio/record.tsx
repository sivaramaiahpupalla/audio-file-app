
// ---- app/(modals)/audio/record.tsx ----
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../styles/theme';

export default function RecordAudio() {
  const [recording, setRecording] = useState(null);
  const [recordingStarted, setRecordingStarted] = useState(false);
  const router = useRouter();

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      setRecording(recording);
      setRecordingStarted(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const originalUri = recording.getURI();
      const filename = `audio-${Date.now()}.3gp`;
      const newUri = FileSystem.documentDirectory + filename;
      await FileSystem.copyAsync({ from: originalUri, to: newUri });
      const status = await recording.getStatusAsync();
      const duration = Math.round(status.durationMillis / 1000);

      setRecording(null);
      setRecordingStarted(false);

      router.push({ pathname: '/[modals]/audio/preview', params: { uri: newUri, duration, from: 'record' } });
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  return (
    <View style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Record Audio</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.recordButton}
          onPress={recordingStarted ? stopRecording : startRecording}
        >
          <Ionicons name={recordingStarted ? 'stop-circle' : 'mic'} size={64} color="white" />
        </TouchableOpacity>
        <Text style={styles.label}>{recordingStarted ? 'Recording...' : 'Tap to Record'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  recordButton: {
    backgroundColor: colors.primary,
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  label: {
    fontSize: 18,
    color: colors.gray,
    marginBottom: 20,
  },
});