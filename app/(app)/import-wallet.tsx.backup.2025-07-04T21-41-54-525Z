import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Platform } from 'react-native';
import { Button, Text, TextInput, useTheme, Portal, Dialog, Card, Chip } from 'react-native-paper';
import { useWallet } from '../context/wallet';
import { useAuth } from '../context/auth';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WalletService } from '../services/wallet';
import { getOrCreateDeviceId } from '../lib/deviceid';
import { getCurrentBaseUrl } from '../lib/axios';

const SUPPORTED_BLOCKCHAINS = [
  { symbol: 'BTC', name: 'Bitcoin', icon: 'bitcoin', color: '#F7931A' },
  { symbol: 'ETH', name: 'Ethereum', icon: 'ethereum', color: '#627EEA' },
  { symbol: 'BNB', name: 'Binance Coin', icon: 'currency-btc', color: '#F3BA2F' },
  { symbol: 'SOL', name: 'Solana', icon: 'currency-btc', color: '#14F195' },
  { symbol: 'AVAX', name: 'Avalanche', icon: 'currency-btc', color: '#E84142' },
  { symbol: 'ARB', name: 'Arbitrum', icon: 'currency-btc', color: '#28A0F0' },
  { symbol: 'MATIC', name: 'Polygon', icon: 'currency-btc', color: '#8247E5' },
  { symbol: 'OP', name: 'Optimism', icon: 'currency-btc', color: '#FF0420' },
  { symbol: 'USDT', name: 'Tether', icon: 'currency-btc', color: '#26A17B' },
  { symbol: 'TRX', name: 'Tron', icon: 'currency-btc', color: '#F4256D' },
];

// Use centralized BASE_URL
const BASE_URL = getCurrentBaseUrl();

export default function ImportWalletScreen() {
  const theme = useTheme();
  const { importWalletByMnemonic, importWalletByPrivateKey } = useWallet();
  const { isAuthenticated, deviceId, register, login } = useAuth();
  const router = useRouter();
  const [importType, setImportType] = useState<'mnemonic' | 'privateKey'>('mnemonic');
  const [importValue, setImportValue] = useState('');
  const [selectedBlockchain, setSelectedBlockchain] = useState<string>('ETH');
  const [error, setError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [importAll, setImportAll] = useState(false);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)/landing');
    }
  }, [isAuthenticated]);

  const handleImport = async () => {
    setError(null);
    if (!importValue.trim()) {
      setError(importType === 'mnemonic' ? 'Enter mnemonic phrase' : 'Enter private key');
      return;
    }

    try {
      setIsImporting(true);
      
      // Call wallet service directly with the correct deviceId
      if (importAll) {
        // Import for all supported blockchains
        for (const blockchain of SUPPORTED_BLOCKCHAINS) {
          try {
            console.log(`Importing ${blockchain.symbol}...`);
            if (importType === 'mnemonic') {
              const response = await WalletService.importWalletByMnemonic(blockchain.symbol, importValue.trim());
              if (!response.success) {
                throw new Error(response.error || 'Import failed');
              }
            } else {
              const response = await WalletService.importWalletByPrivateKey(blockchain.symbol, importValue.trim());
              if (!response.success) {
                throw new Error(response.error || 'Import failed');
              }
            }
            console.log(`${blockchain.symbol} imported successfully`);
          } catch (e: any) {
            console.warn(`Failed to import ${blockchain.symbol}:`, e.message);
            // Continue with other blockchains even if one fails
          }
        }
      } else {
        // Import for selected blockchain only
        console.log(`Importing ${selectedBlockchain}...`);
        if (importType === 'mnemonic') {
          const response = await WalletService.importWalletByMnemonic(selectedBlockchain, importValue.trim());
          if (!response.success) {
            throw new Error(response.error || 'Import failed');
          }
        } else {
          const response = await WalletService.importWalletByPrivateKey(selectedBlockchain, importValue.trim());
          if (!response.success) {
            throw new Error(response.error || 'Import failed');
          }
        }
        console.log(`${selectedBlockchain} imported successfully`);
      }
      
      setShowSuccess(true);
      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (e: any) {
      setError(e.message || 'Failed to import wallet');
    } finally {
      setIsImporting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="headlineMedium">Import Wallet</Text>
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>Import Method</Text>
            <View style={styles.methodButtons}>
              <Button 
                mode={importType === 'mnemonic' ? 'contained' : 'outlined'} 
                onPress={() => setImportType('mnemonic')} 
                style={styles.methodButton}
              >
                Mnemonic Phrase
              </Button>
              <Button 
                mode={importType === 'privateKey' ? 'contained' : 'outlined'} 
                onPress={() => setImportType('privateKey')}
                style={styles.methodButton}
              >
                Private Key
              </Button>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              {importType === 'mnemonic' ? 'Mnemonic Phrase' : 'Private Key'}
            </Text>
            <TextInput
              label={importType === 'mnemonic' ? 'Enter 12 or 24 word mnemonic' : 'Enter private key'}
              value={importValue}
              onChangeText={setImportValue}
              multiline={importType === 'mnemonic'}
              numberOfLines={importType === 'mnemonic' ? 3 : 1}
              autoCapitalize="none"
              style={styles.input}
              placeholder={importType === 'mnemonic' ? 'word1 word2 word3...' : '0x...'}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>Blockchain Selection</Text>
            <View style={styles.importOption}>
              <Button 
                mode={importAll ? 'contained' : 'outlined'} 
                onPress={() => setImportAll(true)}
                style={styles.optionButton}
              >
                Import All Blockchains
              </Button>
              <Text variant="bodySmall" style={styles.optionDescription}>
                Import wallet for all supported blockchains
              </Text>
            </View>
            
            <View style={styles.importOption}>
              <Button 
                mode={!importAll ? 'contained' : 'outlined'} 
                onPress={() => setImportAll(false)}
                style={styles.optionButton}
              >
                Import Specific Blockchain
              </Button>
              <Text variant="bodySmall" style={styles.optionDescription}>
                Import wallet for selected blockchain only
              </Text>
            </View>

            {!importAll && (
              <View style={styles.blockchainSelector}>
                <Text variant="bodyMedium" style={styles.selectorTitle}>Select Blockchain:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.blockchainList}>
                  {SUPPORTED_BLOCKCHAINS.map((blockchain) => (
                    <Chip
                      key={blockchain.symbol}
                      selected={selectedBlockchain === blockchain.symbol}
                      onPress={() => setSelectedBlockchain(blockchain.symbol)}
                      style={styles.blockchainChip}
                      mode="outlined"
                    >
                      <MaterialCommunityIcons 
                        name={blockchain.icon as any} 
                        size={16} 
                        color={blockchain.color} 
                        style={{ marginRight: 4 }}
                      />
                      {blockchain.symbol}
                    </Chip>
                  ))}
                </ScrollView>
              </View>
            )}
          </Card.Content>
        </Card>

        {error && (
          <Card style={[styles.card, { borderColor: theme.colors.error }]}>
            <Card.Content>
              <Text style={{ color: theme.colors.error }}>{error}</Text>
            </Card.Content>
          </Card>
        )}

        <Button 
          mode="contained" 
          onPress={handleImport} 
          loading={isImporting} 
          style={styles.importButton}
          disabled={!importValue.trim()}
        >
          {isImporting ? 'Importing...' : 'Import Wallet'}
        </Button>
      </ScrollView>

      <Portal>
        <Dialog visible={showSuccess} dismissable={false}>
          <Dialog.Title>Wallet Imported Successfully!</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Your wallet has been imported and is ready to use.
              {importAll ? ' All supported blockchains have been imported.' : ` ${selectedBlockchain} wallet has been imported.`}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => router.back()}>Continue</Button>
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
  header: {
    marginBottom: 24,
  },
  content: {
    flex: 1,
  },
  card: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  methodButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  methodButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  input: {
    marginBottom: 8,
  },
  importOption: {
    marginBottom: 16,
  },
  optionButton: {
    marginBottom: 8,
  },
  optionDescription: {
    opacity: 0.7,
    marginLeft: 8,
  },
  blockchainSelector: {
    marginTop: 16,
  },
  selectorTitle: {
    marginBottom: 12,
  },
  blockchainList: {
    marginBottom: 8,
  },
  blockchainChip: {
    marginRight: 8,
  },
  importButton: {
    marginTop: 16,
    marginBottom: 32,
  },
}); 