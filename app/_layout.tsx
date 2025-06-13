import { Slot } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthProvider } from './context/auth';
import { theme } from './theme';

export default function RootLayout() {
  const insets = useSafeAreaInsets();

  return (
    <PaperProvider theme={theme}>
      <View style={[styles.container, { 
        backgroundColor: theme.colors.background,
        paddingTop: insets.top 
      }]}>
        <AuthProvider>
          <Slot />
        </AuthProvider>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 