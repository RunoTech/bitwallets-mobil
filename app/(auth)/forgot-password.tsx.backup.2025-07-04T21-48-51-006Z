import { Link } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Surface, Text, TextInput } from 'react-native-paper';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    // TODO: Implement password reset logic
    console.log('Reset password pressed', { email });
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.surface} elevation={2}>
        <Text variant="headlineMedium" style={styles.title}>Reset Password</Text>
        
        <Text style={styles.description}>
          Enter your email address and we'll send you instructions to reset your password.
        </Text>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleResetPassword}
          style={styles.button}
        >
          Send Reset Instructions
        </Button>

        <View style={styles.links}>
          <Link href="/(auth)/login" asChild>
            <Button mode="text">Back to Login</Button>
          </Link>
        </View>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  surface: {
    padding: 20,
    borderRadius: 10,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  links: {
    marginTop: 16,
    alignItems: 'center',
  },
}); 