// ---- app/audio/index.tsx ----
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Button, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import AudioCard from '../../../components/AudioCard';
import { globalStyles } from '../../../styles/theme';
import { getItems } from '../../../utils/storage';

export default function AudioList() {
  const [audios, setAudios] = useState([]);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const storedAudios = await getItems('audios');
        setAudios(storedAudios);
      };
      load();
    }, [])
  );

  return (
    // <SafeAreaView style={globalStyles.safeArea}>
    <View style={globalStyles.screen}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
        <Text style={globalStyles.title}>Your Library</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={{ fontSize: 24 }}>Audio Library</Text>
        <TouchableOpacity>
          <Ionicons name="add-circle" size={64} color={"#4F46E5"} onPress={() => router.push('/[modals]/audio/record')} />  
        </TouchableOpacity>
      </View>
      <ScrollView style={{ marginTop: 16 }}>
        {audios.length > 0 ? (
          audios.map((item, index) => (
            <AudioCard key={index} item={item} />
          ))
        ) : (
          <View style={{ marginTop: 20 }}>
            <Button title="No audios yet. Tap above to record." disabled />
          </View>
        )}
      </ScrollView>
    </View>
    // </SafeAreaView>
  );
}