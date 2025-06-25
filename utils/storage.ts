// ---- utils/storage.ts ----
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveItem = async (key, value) => {
  const prev = await AsyncStorage.getItem(key);
  const list = prev ? JSON.parse(prev) : [];
  list.push(value);
  await AsyncStorage.setItem(key, JSON.stringify(list));
};

export const getItems = async (key) => {
  const data = await AsyncStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const removeItem = async (key) => {
  await AsyncStorage.removeItem(key);
}