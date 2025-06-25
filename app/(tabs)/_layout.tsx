import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="audio/index"
        options={{
          title: 'Audio',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="music" color={color} />,
        }}
      />
      <Tabs.Screen
        name="files/index"
        options={{
          title: 'Files',
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="upload" color={color} />,
        }}
      />
    </Tabs>
  );
}
