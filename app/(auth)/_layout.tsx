import { Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { useAuth } from '../context/auth';

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to the main app if authenticated
      router.replace('/');
    }
  }, [isAuthenticated]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="landing" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
} 