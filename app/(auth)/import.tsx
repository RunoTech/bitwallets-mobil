import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput, useTheme, Portal, Dialog } from 'react-native-paper';
import { useWallet } from '../context/wallet';
import { useRouter } from 'expo-router';

const SUPPORTED_BLOCKCHAINS = ['BTC', 'ETH', 'SOL', 'AVAX', 'ARB', 'MATIC', 'OP', 'USDT', 'BNB', 'TRX'];

export default function ImportScreen() {
  const theme = useTheme();
  const { importWalletByMnemonic, importWalletByPrivateKey } = useWallet();
  const router = useRouter();
  const [importType, setImportType] = useState<'mnemonic' | 'privateKey'>('mnemonic');
  const [importValue, setImportValue] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleImport = async () => {
    setError(null);
    if (!importValue.trim()) {
      setError(importType === 'mnemonic' ? 'Enter mnemonic phrase' : 'Enter private key');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      setIsImporting(true);
      if (importType === 'mnemonic') {
        for (const blockchain of SUPPORTED_BLOCKCHAINS) {
          await importWalletByMnemonic(blockchain, importValue.trim());
        }
      } else {
        for (const blockchain of SUPPORTED_BLOCKCHAINS) {
          await importWalletByPrivateKey(blockchain, importValue.trim());
        }
      }
      // TODO: Store password-encrypted wallet locally
      setShowSuccess(true);
      setTimeout(() => {
        router.replace('/home');
      }, 2000);
    } catch (e: any) {
      setError(e.message || 'Failed to import wallet');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}> 
      <Text variant="headlineMedium" style={styles.title}>Import Wallet</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
        <Button mode={importType === 'mnemonic' ? 'contained' : 'outlined'} onPress={() => setImportType('mnemonic')} style={{ marginRight: 8 }}>Mnemonic</Button>
        <Button mode={importType === 'privateKey' ? 'contained' : 'outlined'} onPress={() => setImportType('privateKey')}>Private Key</Button>
      </View>
      <TextInput
        label={importType === 'mnemonic' ? 'Mnemonic Phrase' : 'Private Key'}
        value={importValue}
        onChangeText={setImportValue}
        multiline={importType === 'mnemonic'}
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />
      {error && <Text style={{ color: theme.colors.error, marginBottom: 8 }}>{error}</Text>}
      <Button mode="contained" onPress={handleImport} loading={isImporting} style={styles.button}>
        Import Wallet
      </Button>
      <Portal>
        <Dialog visible={showSuccess} dismissable={false}>
          <Dialog.Title>Wallet Imported!</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">Your wallet has been imported and is ready to use.</Text>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    marginBottom: 8,
  },
}); 