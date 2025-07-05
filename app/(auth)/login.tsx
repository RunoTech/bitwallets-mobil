import { Link } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { useAuth } from '../context/auth';

export default function LoginScreen() {
  const [password, setPassword] = useState('');
  const { login, loginEmail } = useAuth();
  const theme = useTheme();

  const handleLogin = () => {
    login(loginEmail, password);
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineMedium" style={styles.title}>
        Welcome Back {loginEmail}
      </Text>
      <TextInput
        label="Email"
        value={loginEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Login
      </Button>
      <Link href="/register" asChild>
        <Button mode="text">Don't have an account? Register</Button>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16
  },
  title: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginBottom: 8,
  },
}); 