import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Button, Card, Text, TextInput, useTheme, IconButton, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SUPPORTED_TOKENS = [
  { symbol: 'BTC', name: 'Bitcoin', icon: 'bitcoin', price: 43250.50 },
  { symbol: 'ETH', name: 'Ethereum', icon: 'ethereum', price: 2650.75 },
  { symbol: 'SOL', name: 'Solana', icon: 'currency-btc', price: 98.25 },
  { symbol: 'MATIC', name: 'Polygon', icon: 'currency-btc', price: 0.85 },
  { symbol: 'AVAX', name: 'Avalanche', icon: 'currency-btc', price: 35.40 },
];

export default function SwapScreen() {
  const theme = useTheme();
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('BTC');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState('0.5');

  const calculateSwap = () => {
    if (!fromAmount) return;
    const fromTokenData = SUPPORTED_TOKENS.find(t => t.symbol === fromToken);
    const toTokenData = SUPPORTED_TOKENS.find(t => t.symbol === toToken);
    if (fromTokenData && toTokenData) {
      const rate = fromTokenData.price / toTokenData.price;
      const result = parseFloat(fromAmount) * rate;
      setToAmount(result.toFixed(6));
    }
  };

  const handleSwap = () => {
    // TODO: Implement actual swap logic
    console.log('Swap executed');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="headlineMedium">Swap</Text>
        <IconButton icon="cog" size={24} onPress={() => {}} />
      </View>

      <Card style={styles.swapCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>From</Text>
          <View style={styles.tokenInput}>
            <TextInput
              label="Amount"
              value={fromAmount}
              onChangeText={(text) => {
                setFromAmount(text);
                calculateSwap();
              }}
              keyboardType="numeric"
              style={styles.amountInput}
            />
            <Button mode="outlined" onPress={() => {}} style={styles.tokenButton}>
              {fromToken}
            </Button>
          </View>
          
          <View style={styles.swapIcon}>
            <IconButton 
              icon="swap-vertical" 
              size={30} 
              onPress={() => {
                const temp = fromToken;
                setFromToken(toToken);
                setToToken(temp);
                calculateSwap();
              }}
            />
          </View>

          <Text variant="titleMedium" style={styles.sectionTitle}>To</Text>
          <View style={styles.tokenInput}>
            <TextInput
              label="Amount"
              value={toAmount}
              onChangeText={setToAmount}
              keyboardType="numeric"
              style={styles.amountInput}
            />
            <Button mode="outlined" onPress={() => {}} style={styles.tokenButton}>
              {toToken}
            </Button>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.swapInfo}>
            <View style={styles.infoRow}>
              <Text variant="bodyMedium">Rate</Text>
              <Text variant="bodyMedium">1 {fromToken} = {toToken}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text variant="bodyMedium">Slippage</Text>
              <Text variant="bodyMedium">{slippage}%</Text>
            </View>
            <View style={styles.infoRow}>
              <Text variant="bodyMedium">Network Fee</Text>
              <Text variant="bodyMedium">~$2.50</Text>
            </View>
          </View>

          <Button 
            mode="contained" 
            onPress={handleSwap}
            style={styles.swapButton}
            disabled={!fromAmount || !toAmount}
          >
            Swap {fromToken} for {toToken}
          </Button>
        </Card.Content>
      </Card>

      <Text variant="titleMedium" style={styles.sectionTitle}>Quick Swap</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickSwap}>
        {SUPPORTED_TOKENS.map((token) => (
          <Card key={token.symbol} style={styles.quickSwapCard}>
            <Card.Content style={styles.quickSwapContent}>
              <MaterialCommunityIcons name={token.icon as any} size={24} color={theme.colors.primary} />
              <Text variant="bodyMedium">{token.symbol}</Text>
              <Text variant="bodySmall">${token.price.toLocaleString()}</Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  swapCard: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  tokenInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  amountInput: {
    flex: 1,
    marginRight: 12,
  },
  tokenButton: {
    minWidth: 80,
  },
  swapIcon: {
    alignItems: 'center',
    marginVertical: 8,
  },
  divider: {
    marginVertical: 16,
  },
  swapInfo: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  swapButton: {
    marginTop: 8,
  },
  quickSwap: {
    marginBottom: 16,
  },
  quickSwapCard: {
    marginRight: 12,
    minWidth: 80,
  },
  quickSwapContent: {
    alignItems: 'center',
    padding: 12,
  },
}); 