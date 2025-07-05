import React from 'react';
import { View, StyleSheet, Share } from 'react-native';
import { Text, Button, useTheme, IconButton, Card, Divider } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useWallet } from '../context/wallet';
import { ALL_COINS } from './coin-management';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import Clipboard from '@react-native-clipboard/clipboard';

export default function ReceiveDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { coin } = useLocalSearchParams<{ coin: string }>();
  const { wallets } = useWallet();

  const wallet = wallets.find(w => w.network === coin);
  const address = wallet ? wallet.wallet : 'No address found';
  const coinInfo = ALL_COINS.find(c => c.symbol === coin);

  const [copied, setCopied] = React.useState(false);
  const handleCopy = () => {
    if (address && address !== 'No address found') {
      Clipboard.setString(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <View style={styles.header}>
        <IconButton icon="arrow-left" size={28} onPress={() => router.back()} />
        <Text variant="headlineMedium" style={styles.headerTitle}>Receive {coin}</Text>
        <View style={{ width: 48 }} />
      </View>
      <Card style={styles.card} elevation={2}>
        <View style={styles.coinInfo}>
          {coinInfo && (
            <MaterialCommunityIcons name={coinInfo.icon as any} size={40} color={coinInfo.color} style={styles.coinIcon} />
          )}
          <Text style={styles.coinName}>{coinInfo?.name}</Text>
          <Text style={styles.coinSymbol}>{coinInfo?.symbol}</Text>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.qrSection}>
          {address && address !== 'No address found' ? (
            <QRCode value={address} size={180} backgroundColor="transparent" />
          ) : (
            <Text style={{ color: 'gray' }}>[QR Code Here]</Text>
          )}
        </View>
        <Divider style={styles.divider} />
        <View style={styles.addressRow}>
          <Text selectable style={styles.address}>{address}</Text>
          <IconButton icon={copied ? 'check' : 'content-copy'} size={22} onPress={handleCopy} style={styles.copyIcon} />
        </View>
      </Card>
      <Button
        mode="contained"
        onPress={async () => {
          if (address && address !== 'No address found') {
            try {
              await Share.share({
                message: address,
              });
            } catch (error) {
              // Optionally handle error
            }
          }
        }}
        style={styles.button}
      >
        Share Address
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
    fontWeight: 'bold',
    fontSize: 22,
  },
  card: {
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
    marginTop: 8,
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
    elevation: 0,
  },
  coinInfo: {
    alignItems: 'center',
    marginBottom: 8,
  },
  coinIcon: { marginBottom: 4 },
  coinName: { fontSize: 18, fontWeight: 'bold' },
  coinSymbol: { fontSize: 14, color: '#888', marginBottom: 8 },
  divider: { marginVertical: 12 },
  qrSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    backgroundColor: '#f3f3f6',
    borderRadius: 16,
    padding: 16,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  address: { fontSize: 16, marginRight: 8, maxWidth: '80%' },
  copyIcon: { marginLeft: 0 },
  label: { marginTop: 12, marginBottom: 4, textAlign: 'center' },
  button: { marginTop: 8, borderRadius: 8 },
}); 