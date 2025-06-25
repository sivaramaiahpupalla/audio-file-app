// ---- components/FileCard.tsx ----
import { Button, Linking, Text, View } from 'react-native';
import { globalStyles } from '../styles/theme';

export default function FileCard({ item }) {
  return (
    <View style={globalStyles.card}>
      <Text style={globalStyles.title}>{item.name}</Text>
      <Text style={globalStyles.subtitle}>Type: {item.type}</Text>
      <Button title="Open File" onPress={() => Linking.openURL(item.uri)} />
    </View>
  );
}