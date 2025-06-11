import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { useAuth } from '../context/auth';

export default function HomeScreen() {
  const { logout } = useAuth();
  const theme = useTheme();

  return (
    <View style={[styles.screen]}>
      <Text variant="headlineMedium" style={styles.title}>
        Welcome to BitWallets
      </Text>
      <Button mode="contained" onPress={logout}>
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  title: {
    marginBottom: 24,
  },
}); 