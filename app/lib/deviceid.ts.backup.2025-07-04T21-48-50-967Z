import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';

const DEVICE_ID_KEY = 'deviceid';

function generateDeviceId() {
  const part1 = Math.random().toString(36).substring(2, 10);
  const part2 = Math.random().toString(36).substring(2, 14);
  return `device_${part1}_${part2}`;
}

function getExpoDeviceIdFallback(): string | null {
  // Try to use the most stable Expo device identifier available
  return (
    Device.osInternalBuildId ||
    Device.modelId ||
    Device.modelName ||
    Device.osBuildId ||
    Device.deviceName ||
    null
  );
}

export async function getOrCreateDeviceId(): Promise<string> {
  let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    let expoDeviceId = getExpoDeviceIdFallback();
    if (expoDeviceId && typeof expoDeviceId === 'string' && expoDeviceId.length > 0) {
      deviceId = `expo_${expoDeviceId}`;
    } else {
      deviceId = generateDeviceId();
    }
    await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
}

export async function resetDeviceId(): Promise<string> {
  let expoDeviceId = getExpoDeviceIdFallback();
  let newDeviceId;
  if (expoDeviceId && typeof expoDeviceId === 'string' && expoDeviceId.length > 0) {
    newDeviceId = `expo_${expoDeviceId}`;
  } else {
    newDeviceId = generateDeviceId();
  }
  await AsyncStorage.setItem(DEVICE_ID_KEY, newDeviceId);
  return newDeviceId;
} 