import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, TextInput, useTheme, IconButton } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { WalletService } from '../services/wallet';
import { ethers } from 'ethers';
import * as bip39 from 'bip39';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SendFormScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { coin } = useLocalSearchParams<{ coin: string }>();
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [sending, setSending] = useState(false);
  const [estimatedFee, setEstimatedFee] = useState<string>('');
  const [feeLoading, setFeeLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [privateKey, setPrivateKey] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        const resp = await WalletService.getWallets();
        if (resp.success && resp.data) {
          const found = resp.data.find((w: any) => w.network === coin);
          setWalletAddress(found?.wallet || '');
          setPrivateKey(found ? (found as any)['private_key'] || '' : '');
        }
      } catch {}
    })();
  }, [coin]);

  const handleSend = async () => {
    setSending(true);
    try {
      if (!walletAddress) {
        Alert.alert('Error', 'No wallet address found for this coin.');
        setSending(false);
        return;
      }
      if (!privateKey) {
        Alert.alert('Error', 'No private key found for this wallet.');
        setSending(false);
        return;
      }
      const params = {
        currency: coin,
        amount: parseFloat(amount),
        fromAddress: walletAddress,
        toAddress: address,
        deviceid: (await AsyncStorage.getItem('deviceid')) || '',
        privateKey: privateKey,
      };
      const result = await WalletService.transfer(params);
      if (result.success && result.data) {
        Alert.alert('Success', `Transaction sent! TX Hash: ${result.data.txid || ''}`);
        setAmount('');
        setAddress('');
        router.back();
      } else {
        throw new Error(result.error || 'Failed to send transaction');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to send transaction');
    } finally {
      setSending(false);
    }
  };

  const fetchEstimatedFee = async () => {
    if (!address || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setEstimatedFee('');
      return;
    }
    setFeeLoading(true);
    try {
      const resp = await WalletService.estimateFee({
        currency: coin,
        amount: parseFloat(amount),
        fromAddress: walletAddress,
        toAddress: address,
      });
      if (resp.success && resp.data && resp.data.fee) {
        setEstimatedFee(Number(resp.data.fee).toFixed(6));
      } else {
        setEstimatedFee('');
      }
    } catch (e) {
      setEstimatedFee('');
    } finally {
      setFeeLoading(false);
    }
  };

  useEffect(() => {
    fetchEstimatedFee();
  }, [amount, address, coin]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <View style={styles.header}>
        <IconButton icon="arrow-left" size={28} onPress={() => router.back()} />
        <Text variant="headlineMedium" style={styles.headerTitle}>Send {coin}</Text>
        <View style={{ width: 48 }} />
      </View>
      <TextInput
        label="Recipient Address"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        label="Amount"
        value={amount}
        onChangeText={setAmount}
        style={styles.input}
        keyboardType="numeric"
      />
      {estimatedFee !== '' && (
        <Text style={{ marginBottom: 8, color: theme.colors.onSurface }}>
          Estimated Network Fee: {feeLoading ? 'Loading...' : `${estimatedFee} BNB`}
        </Text>
      )}
      <Button mode="contained" onPress={handleSend} loading={sending} disabled={sending || !address || !amount} style={styles.button}>
        Send
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  input: { marginBottom: 16 },
  button: { marginTop: 24 },
}); 