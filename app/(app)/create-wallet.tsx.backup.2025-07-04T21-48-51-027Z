import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme, Portal, Dialog, TextInput } from 'react-native-paper';
import { useWallet } from '../context/wallet';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../context/auth';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SUPPORTED_BLOCKCHAINS = [
  { id: 'BTC', name: 'Bitcoin', icon: 'bitcoin' },
  { id: 'ETH', name: 'Ethereum', icon: 'ethereum' },
  { id: 'SOL', name: 'Solana', icon: 'alpha-s-circle-outline' },
  { id: 'AVAX', name: 'Avalanche', icon: 'snowflake' },
  { id: 'ARB', name: 'Arbitrum', icon: 'alpha-a-circle-outline' },
  { id: 'MATIC', name: 'Polygon', icon: 'polygon' },
  { id: 'OP', name: 'Optimism', icon: 'alpha-o-circle-outline' },
  { id: 'USDT', name: 'Tether', icon: 'tether' },
  { id: 'BNB', name: 'Binance Coin', icon: 'diamond-outline' },
  { id: 'TRX', name: 'Tron', icon: 'alpha-t-circle-outline' }
];

export default function CreateWalletScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { createWallet, importWalletByMnemonic, importWalletByPrivateKey } = useWallet();
  const { deviceId, isAuthenticated, token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedBlockchain, setSelectedBlockchain] = useState<string | null>(null);
  const [importType, setImportType] = useState<'mnemonic' | 'privateKey' | null>(null);
  const [importValue, setImportValue] = useState('');
  const [importBlockchain, setImportBlockchain] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);

  if (!deviceId) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }]}> 
        <Text variant="headlineMedium" style={styles.title}>Loading device ID...</Text>
      </View>
    );
  }

  if (!isAuthenticated || !token) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }]}> 
        <Text variant="headlineMedium" style={styles.title}>Authentication Required</Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Please log in to create wallets
        </Text>
        <Button 
          mode="contained" 
          onPress={() => router.push('/login')}
          style={{ marginTop: 16 }}
        >
          Go to Login
        </Button>
      </View>
    );
  }

  const handleCreateWallet = async (blockchain: string) => {
    try {
      console.log('=== CREATE WALLET ATTEMPT ===');
      console.log('Blockchain:', blockchain);
      console.log('Device ID:', deviceId);
      console.log('Is authenticated:', isAuthenticated);
      console.log('Token exists:', !!token);
      
      setIsLoading(true);
      setError(null);
      setSelectedBlockchain(blockchain);
      if (!deviceId) {
        setError('Device ID not found. Please restart the app.');
        return;
      }
      
      if (!isAuthenticated || !token) {
        setError('Authentication required. Please log in first.');
        return;
      }
      
      // Create wallet using the real API
      await createWallet(blockchain);
      // Show success
      setShowSuccess(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // Navigate back after delay
      setTimeout(() => {
        router.replace('/home');
      }, 2000);
    } catch (err: any) {
      console.error('Create wallet error:', err);
      setError(err.message || 'Failed to create wallet');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportWallet = async () => {
    if (!importBlockchain) {
      setImportError('Please select a blockchain');
      return;
    }
    if (!importValue.trim()) {
      setImportError(importType === 'mnemonic' ? 'Enter mnemonic phrase' : 'Enter private key');
      return;
    }
    try {
      setIsLoading(true);
      setImportError(null);
      if (importType === 'mnemonic') {
        await importWalletByMnemonic(importBlockchain, importValue.trim());
      } else {
        await importWalletByPrivateKey(importBlockchain, importValue.trim());
      }
      setShowImportDialog(false);
      setImportValue('');
      setImportBlockchain(null);
      setImportType(null);
      setShowSuccess(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => {
        router.replace('/home');
      }, 2000);
    } catch (err: any) {
      setImportError(err.message || 'Failed to import wallet');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineMedium" style={styles.title}>
        Create New Wallet
      </Text>
      <Text variant="bodyLarge" style={styles.subtitle}>
        Select a blockchain to create your wallet
      </Text>

      {error && (
        <Text style={[styles.error, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}

      <View style={styles.blockchainGrid}>
        {SUPPORTED_BLOCKCHAINS.map((blockchain) => (
          <Button
            key={blockchain.id}
            mode="contained"
            onPress={() => handleCreateWallet(blockchain.id)}
            loading={isLoading && selectedBlockchain === blockchain.id}
            disabled={isLoading}
            style={styles.blockchainButton}
            icon={({ size, color }) => (
              <MaterialCommunityIcons name={blockchain.icon as any} size={size} color={color} />
            )}
          >
            {blockchain.name}
          </Button>
        ))}
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 }}>
        <Button mode="outlined" onPress={() => { setImportType('mnemonic'); setShowImportDialog(true); }}>Import by Mnemonic</Button>
        <Button mode="outlined" onPress={() => { setImportType('privateKey'); setShowImportDialog(true); }}>Import by Private Key</Button>
      </View>

      <Portal>
        <Dialog visible={showSuccess} dismissable={false}>
          <Dialog.Title>Wallet Created Successfully!</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Your {selectedBlockchain} wallet has been created and is ready to use.
            </Text>
          </Dialog.Content>
        </Dialog>
        <Dialog visible={showImportDialog} onDismiss={() => setShowImportDialog(false)}>
          <Dialog.Title>Import Wallet by {importType === 'mnemonic' ? 'Mnemonic' : 'Private Key'}</Dialog.Title>
          <Dialog.Content>
            <Text>Select Blockchain</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginVertical: 8 }}>
              {SUPPORTED_BLOCKCHAINS.map((blockchain) => (
                <Button
                  key={blockchain.id}
                  mode={importBlockchain === blockchain.id ? 'contained' : 'outlined'}
                  onPress={() => setImportBlockchain(blockchain.id)}
                  style={{ margin: 2 }}
                >
                  {blockchain.name}
                </Button>
              ))}
            </View>
            <TextInput
              label={importType === 'mnemonic' ? 'Mnemonic Phrase' : 'Private Key'}
              value={importValue}
              onChangeText={setImportValue}
              multiline={importType === 'mnemonic'}
              autoCapitalize="none"
              style={{ marginTop: 8 }}
            />
            {importError && <Text style={{ color: theme.colors.error, marginTop: 8 }}>{importError}</Text>}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowImportDialog(false)}>Cancel</Button>
            <Button onPress={handleImportWallet} loading={isLoading}>Import</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 24,
    textAlign: 'center',
    opacity: 0.7,
  },
  blockchainGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  blockchainButton: {
    width: '48%',
    marginBottom: 12,
  },
  error: {
    marginBottom: 16,
    textAlign: 'center',
  },
}); 