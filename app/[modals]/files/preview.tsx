// ---- app/(modals)/files/preview.tsx ----
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function FilePreview() {
  const { uri, type } = useLocalSearchParams();
  const router = useRouter();

  const renderPreview = () => {
    if (type?.startsWith('image/')) {
      return <Image source={{ uri }} style={styles.image} resizeMode="contain" />;
    }
    if (type?.startsWith('video/')) {
      return <Video source={{ uri }} useNativeControls style={styles.video} resizeMode="contain" />;
    }
    if (type === 'application/pdf') {
      return (
        <WebView
          source={{ uri: 'https://reactnative.dev/docs/navigation' }}
          style={styles.webview}
          originWhitelist={['*']}
          allowFileAccess
          allowUniversalAccessFromFileURLs
          javaScriptEnabled
          domStorageEnabled
        />
      );
    }
    return <Text style={styles.unsupported}>Unsupported file format</Text>;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/files')}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>File Preview</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={styles.content}>{renderPreview()}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  image: {
    width: '100%',
    height: '90%',
  },
  video: {
    width: '100%',
    height: 300,
  },
  webview: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'red'
  },
  unsupported: {
    fontSize: 16,
    color: 'gray',
  },
});