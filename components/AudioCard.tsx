// ---- components/AudioCard.tsx ----
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { globalStyles } from '../styles/theme';

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

export default function AudioCard({ item }) {
  const router = useRouter();

  return (
    <View style={globalStyles.card}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}
            >
                <Ionicons name="mic" size={32} color="#4F46E5" />
                <View>
                    <Text style={globalStyles.title}>{item.name}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={globalStyles.subtitle}>{formatTime(item.duration)} - {item.size}</Text>
                    </View>
                </View>
            </View>
            <View>
                <Ionicons name="play" size={32} color="#4F46E5" onPress={() => router.push({ pathname: '/[modals]/audio/preview', params: { uri: item.uri, duration: item.duration } })} />
            </View>
        </View>
    </View>
  );
}
