// ---- styles/theme.ts ----
import { Platform, StatusBar, StyleSheet } from 'react-native';

export const colors = {
  primary: '#4F46E5',
  background: '#F9FAFB',
  card: '#FFFFFF',
  text: '#111827',
  gray: '#6B7280',
};

export const globalStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
    paddingTop: Platform.OS === 'android' ? ((StatusBar.currentHeight ?? 0) + 16) : 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray,
    marginTop: 4,
    marginBottom: 8,
  },
});