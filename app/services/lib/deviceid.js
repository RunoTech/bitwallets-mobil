"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrCreateDeviceId = getOrCreateDeviceId;
exports.resetDeviceId = resetDeviceId;
const async_storage_1 = require("@react-native-async-storage/async-storage");
const Device = require("expo-device");
const DEVICE_ID_KEY = 'deviceid';
function generateDeviceId() {
    const part1 = Math.random().toString(36).substring(2, 10);
    const part2 = Math.random().toString(36).substring(2, 14);
    return `device_${part1}_${part2}`;
}
function getExpoDeviceIdFallback() {
    // Try to use the most stable Expo device identifier available
    return (Device.osInternalBuildId ||
        Device.modelId ||
        Device.modelName ||
        Device.osBuildId ||
        Device.deviceName ||
        null);
}
async function getOrCreateDeviceId() {
    let deviceId = await async_storage_1.default.getItem(DEVICE_ID_KEY);
    if (!deviceId) {
        let expoDeviceId = getExpoDeviceIdFallback();
        if (expoDeviceId && typeof expoDeviceId === 'string' && expoDeviceId.length > 0) {
            deviceId = `expo_${expoDeviceId}`;
        }
        else {
            deviceId = generateDeviceId();
        }
        await async_storage_1.default.setItem(DEVICE_ID_KEY, deviceId);
    }
    return deviceId;
}
async function resetDeviceId() {
    let expoDeviceId = getExpoDeviceIdFallback();
    let newDeviceId;
    if (expoDeviceId && typeof expoDeviceId === 'string' && expoDeviceId.length > 0) {
        newDeviceId = `expo_${expoDeviceId}`;
    }
    else {
        newDeviceId = generateDeviceId();
    }
    await async_storage_1.default.setItem(DEVICE_ID_KEY, newDeviceId);
    return newDeviceId;
}
