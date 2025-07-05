import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Button, Card, Text, useTheme, IconButton, Switch, Searchbar, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

// All available cryptocurrencies
const ALL_COINS = [
  { symbol: 'BTC', name: 'Bitcoin', icon: 'bitcoin', color: '#F7931A', category: 'Major' },
  { symbol: 'ETH', name: 'Ethereum', icon: 'ethereum', color: '#627EEA', category: 'Major' },
  { symbol: 'BNB', name: 'Binance Coin', icon: 'currency-btc', color: '#F3BA2F', category: 'Major' },
  { symbol: 'SOL', name: 'Solana', icon: 'currency-btc', color: '#14F195', category: 'Major' },
  { symbol: 'AVAX', name: 'Avalanche', icon: 'currency-btc', color: '#E84142', category: 'Major' },
  { symbol: 'ARB', name: 'Arbitrum', icon: 'currency-btc', color: '#28A0F0', category: 'Layer 2' },
  { symbol: 'MATIC', name: 'Polygon', icon: 'currency-btc', color: '#8247E5', category: 'Layer 2' },
  { symbol: 'OP', name: 'Optimism', icon: 'currency-btc', color: '#FF0420', category: 'Layer 2' },
  { symbol: 'USDT', name: 'Tether', icon: 'currency-btc', color: '#26A17B', category: 'Stablecoin' },
  { symbol: 'TRX', name: 'Tron', icon: 'currency-btc', color: '#F4256D', category: 'Major' },
];

const COIN_VISIBILITY_KEY = 'coin_visibility_settings';

export { ALL_COINS };

export default function CoinManagementScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [coinVisibility, setCoinVisibility] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Categories for filtering
  const categories = ['All', 'Major', 'Layer 2', 'Stablecoin', 'Testnet'];

  useEffect(() => {
    loadCoinVisibility();
  }, []);

  const loadCoinVisibility = async () => {
    try {
      const savedVisibility = await AsyncStorage.getItem(COIN_VISIBILITY_KEY);
      if (savedVisibility) {
        setCoinVisibility(JSON.parse(savedVisibility));
      } else {
        // Default: show all coins
        const defaultVisibility = ALL_COINS.reduce((acc, coin) => {
          acc[coin.symbol] = true;
          return acc;
        }, {} as Record<string, boolean>);
        setCoinVisibility(defaultVisibility);
        await AsyncStorage.setItem(COIN_VISIBILITY_KEY, JSON.stringify(defaultVisibility));
      }
    } catch (error) {
      console.error('Error loading coin visibility:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCoinVisibility = async (symbol: string) => {
    try {
      const newVisibility = {
        ...coinVisibility,
        [symbol]: !coinVisibility[symbol]
      };
      setCoinVisibility(newVisibility);
      await AsyncStorage.setItem(COIN_VISIBILITY_KEY, JSON.stringify(newVisibility));
    } catch (error) {
      console.error('Error saving coin visibility:', error);
    }
  };

  const toggleAllCoins = async (visible: boolean) => {
    try {
      const newVisibility = ALL_COINS.reduce((acc, coin) => {
        acc[coin.symbol] = visible;
        return acc;
      }, {} as Record<string, boolean>);
      setCoinVisibility(newVisibility);
      await AsyncStorage.setItem(COIN_VISIBILITY_KEY, JSON.stringify(newVisibility));
    } catch (error) {
      console.error('Error saving coin visibility:', error);
    }
  };

  const filteredCoins = ALL_COINS.filter(coin => {
    const matchesSearch = coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         coin.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || coin.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const visibleCount = Object.values(coinVisibility).filter(Boolean).length;
  const totalCount = ALL_COINS.length;

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text>Loading coin settings...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
        <Text variant="headlineMedium">Coin Management</Text>
        <View style={{ width: 48 }} />
      </View>

      <View style={styles.summary}>
        <Card style={styles.summaryCard}>
          <Card.Content style={styles.summaryContent}>
            <View style={styles.summaryItem}>
              <Text variant="titleLarge">{visibleCount}</Text>
              <Text variant="bodySmall">Visible</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text variant="titleLarge">{totalCount - visibleCount}</Text>
              <Text variant="bodySmall">Hidden</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text variant="titleLarge">{totalCount}</Text>
              <Text variant="bodySmall">Total</Text>
            </View>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.actions}>
        <Button 
          mode="outlined" 
          onPress={() => toggleAllCoins(true)}
          style={styles.actionButton}
        >
          Show All
        </Button>
        <Button 
          mode="outlined" 
          onPress={() => toggleAllCoins(false)}
          style={styles.actionButton}
        >
          Hide All
        </Button>
      </View>

      <Searchbar
        placeholder="Search coins..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <View style={styles.categoryFilter}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <Chip
              key={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
              style={styles.categoryChip}
              mode="outlined"
            >
              {category}
            </Chip>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.coinList}>
        {filteredCoins.map((coin) => (
          <Card key={coin.symbol} style={styles.coinCard}>
            <Card.Content style={styles.coinContent}>
              <View style={styles.coinInfo}>
                <MaterialCommunityIcons 
                  name={coin.icon as any} 
                  size={32} 
                  color={coin.color} 
                />
                <View style={styles.coinDetails}>
                  <Text variant="titleMedium">{coin.name}</Text>
                  <Text variant="bodySmall">{coin.symbol}</Text>
                  <Chip 
                    mode="outlined" 
                    style={styles.categoryTag}
                    textStyle={{ fontSize: 10 }}
                  >
                    {coin.category}
                  </Chip>
                </View>
              </View>
              <View style={styles.coinActions}>
                <Switch
                  value={coinVisibility[coin.symbol] || false}
                  onValueChange={() => toggleCoinVisibility(coin.symbol)}
                  color={theme.colors.primary}
                />
                <Text variant="bodySmall" style={styles.visibilityText}>
                  {coinVisibility[coin.symbol] ? 'Visible' : 'Hidden'}
                </Text>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Text variant="bodySmall" style={styles.footerText}>
          Changes will be reflected on the home screen
        </Text>
      </View>
    </View>
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
  summary: {
    marginBottom: 16,
  },
  summaryCard: {
    marginBottom: 16,
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  searchBar: {
    marginBottom: 16,
  },
  categoryFilter: {
    marginBottom: 16,
  },
  categoryChip: {
    marginRight: 8,
  },
  coinList: {
    flex: 1,
  },
  coinCard: {
    marginBottom: 8,
  },
  coinContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coinInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  coinDetails: {
    marginLeft: 12,
    flex: 1,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  coinActions: {
    alignItems: 'center',
  },
  visibilityText: {
    marginTop: 4,
  },
  footer: {
    alignItems: 'center',
    marginTop: 16,
  },
  footerText: {
    opacity: 0.7,
  },
}); 