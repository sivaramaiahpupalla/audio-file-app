// ---- app/files/index.tsx ----
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../styles/theme';
import { getItems, saveItem } from '../../../utils/storage';

export default function FilesScreen() {
  const [files, setFiles] = useState([]);
  const router = useRouter();

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*', 'video/*'],
      copyToCacheDirectory: true,
    });
    if (!result.canceled && result.assets.length > 0) {
      const file = result.assets[0];
      const info = await FileSystem.getInfoAsync(file.uri);
      const size = info.size ? (info.size / 1024).toFixed(1) + ' KB' : 'Unknown';
      const newFile = {
        name: file.name,
        uri: file.uri,
        size,
        mimeType: file.mimeType,
      };
      const updated = [...files, newFile];
      setFiles(updated);
      await saveItem('docs', newFile);
    }
  };

  const loadFiles = async () => {
    const stored = await getItems('docs');
    if (stored) setFiles(Array.isArray(stored) ? stored : [stored]);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const openPreview = (file) => {
    router.push({ pathname: '/[modals]/files/preview', params: { uri: file.uri, type: file.mimeType } });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>My Files</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ fontSize: 24 }}>Documents</Text>
          <TouchableOpacity>
            <Ionicons name="add-circle" size={64} color={"#4F46E5"} onPress={pickFile} />  
          </TouchableOpacity>
        </View>

        <FlatList
          data={files}
          keyExtractor={(item) => item.uri}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.fileCard} onPress={() => openPreview(item)}>
              <Ionicons name="document-text" size={24} color={colors.primary} style={{ marginRight: 12 }} />
              <View>
                <Text style={styles.fileName}>{item.name}</Text>
                <Text style={styles.fileDetails}>{item.size} • {item.mimeType}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
    color: colors.text,
  },
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  uploadText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
  fileCard: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  fileName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  fileDetails: {
    fontSize: 12,
    color: colors.gray,
    marginTop: 2,
  },
});