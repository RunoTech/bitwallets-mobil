import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, RefreshControl } from 'react-native';
import { Button, Card, Text, useTheme, IconButton, Divider } from 'react-native-paper';
import { useAuth } from '../../context/auth';
import { useWallet } from '../../context/wallet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ALL_COINS } from '../coin-management';

// Demo price data
const PRICES = {
  BTC: { price: 65000, change: 2.5 },
  ETH: { price: 3500, change: -1.2 },
  SOL: { price: 140, change: 5.8 },
  AVAX: { price: 35, change: -2.1 },
  ARB: { price: 1.2, change: 1.5 },
  MATIC: { price: 0.85, change: 3.2 },
  OP: { price: 2.1, change: -0.8 },
  USDT: { price: 1, change: 0 },
  BNB: { price: 420, change: 3.1 },
};

// Demo recent transactions
const RECENT_TRANSACTIONS = [
  { id: 1, type: 'send', amount: 0.1, currency: 'BTC', address: 'bc1q...2n0yr', date: '2 hours ago', status: 'completed' },
  { id: 2, type: 'receive', amount: 1.5, currency: 'ETH', address: '0x74...f44e', date: '1 day ago', status: 'completed' },
  { id: 3, type: 'send', amount: 100, currency: 'USDT', address: '0x12...3abc', date: '2 days ago', status: 'pending' }
];

const COIN_VISIBILITY_KEY = 'coin_visibility_settings';

export default function HomeScreen() {
  const { wallets, isLoading, getWallets } = useWallet();
  const { logout, isAuthenticated, setOnRegistrationComplete } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [coinVisibility, setCoinVisibility] = useState<Record<string, boolean>>({});
  const [isVisibilityLoaded, setIsVisibilityLoaded] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)/landing');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadCoinVisibility();
  }, []);

  // Reload visibility settings when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadCoinVisibility();
    }, [])
  );

  useEffect(() => {
    // Set registration complete callback to refresh wallets
    if (isAuthenticated) {
      setOnRegistrationComplete(() => getWallets);
      return () => setOnRegistrationComplete(undefined);
    }
  }, [setOnRegistrationComplete, getWallets, isAuthenticated]);

  useEffect(() => {
    // On mount, check if just registered and force wallet refresh
    const checkJustRegistered = async () => {
      if (!isAuthenticated) return;
      
      const justRegistered = await AsyncStorage.getItem('just_registered');
      if (justRegistered === 'true') {
        await getWallets();
        await AsyncStorage.removeItem('just_registered');
      }
    };
    checkJustRegistered();
  }, [getWallets, isAuthenticated]);

  useEffect(() => {
    // Only fetch wallets if authenticated
    if (isAuthenticated) {
      getWallets();
    }
  }, [getWallets, isAuthenticated]);

  const loadCoinVisibility = async () => {
    try {
      const savedVisibility = await AsyncStorage.getItem(COIN_VISIBILITY_KEY);
      if (savedVisibility) {
        setCoinVisibility(JSON.parse(savedVisibility));
      } else {
        // Default: show all coins if no settings exist
        const defaultVisibility = {
          BTC: true, ETH: true, BNB: true, SOL: true, AVAX: true,
          ARB: true, MATIC: true, OP: true, USDT: true,
        };
        setCoinVisibility(defaultVisibility);
        await AsyncStorage.setItem(COIN_VISIBILITY_KEY, JSON.stringify(defaultVisibility));
      }
    } catch (error) {
      console.error('Error loading coin visibility:', error);
      // Fallback: show all coins
      const defaultVisibility = {
        BTC: true, ETH: true, BNB: true, SOL: true, AVAX: true,
        ARB: true, MATIC: true, OP: true, USDT: true,
      };
      setCoinVisibility(defaultVisibility);
    } finally {
      setIsVisibilityLoaded(true);
    }
  };

  const handleCreateWallet = () => {
    // Navigate to import wallet screen
    router.push('/(app)/import-wallet');
  };

  const calculateTotalBalance = () => {
    if (!isVisibilityLoaded) return 0;
    
    return wallets
      .filter(wallet => coinVisibility[wallet.network] === true) // Only include explicitly visible coins
      .reduce((total, wallet) => {
        const price = PRICES[wallet.network as keyof typeof PRICES]?.price || 0;
        return total + (wallet.balance * price);
      }, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const renderQuickActions = () => (
    <View style={styles.quickActions}>
      <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
        <View style={styles.iconContainer}>
          <IconButton icon="swap-horizontal" size={32} iconColor="white" />
        </View>
        <Text style={styles.actionButtonText}>Swap</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(app)/send')}>
        <View style={styles.iconContainer}>
          <IconButton icon="arrow-up" size={32} iconColor="white" />
        </View>
        <Text style={styles.actionButtonText}>Send</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(app)/receive')}>
        <View style={styles.iconContainer}>
          <IconButton icon="arrow-down" size={32} iconColor="white" />
        </View>
        <Text style={styles.actionButtonText}>Receive</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
        <View style={styles.iconContainer}>
          <IconButton icon="chart-line" size={32} iconColor="white" />
        </View>
        <Text style={styles.actionButtonText}>Stake</Text>
      </TouchableOpacity>
    </View>
  );

  const renderRecentTransactions = () => (
    <View style={styles.recentTransactions}>
      <Text variant="titleMedium" style={styles.sectionTitle}>Recent Transactions</Text>
      {RECENT_TRANSACTIONS.map((tx) => (
        <Card key={tx.id} style={styles.transactionCard}>
          <Card.Content style={styles.transactionContent}>
            <View style={styles.transactionLeft}>
              <IconButton
                icon={tx.type === 'send' ? 'arrow-up' : 'arrow-down'}
                size={24}
                iconColor={tx.type === 'send' ? theme.colors.error : theme.colors.primary}
              />
              <View>
                <Text variant="bodyMedium">
                  {tx.type === 'send' ? 'Sent' : 'Received'} {tx.amount} {tx.currency}
                </Text>
                <Text variant="bodySmall" style={{ opacity: 0.7 }}>
                  {tx.address}
                </Text>
              </View>
            </View>
            <View style={styles.transactionRight}>
              <Text variant="bodySmall" style={{ opacity: 0.7 }}>
                {tx.date}
              </Text>
              <Text
                variant="bodySmall"
                style={{
                  color: tx.status === 'completed' ? theme.colors.primary : theme.colors.error
                }}
              >
                {tx.status}
              </Text>
            </View>
          </Card.Content>
        </Card>
      ))}
    </View>
  );

  // Filter wallets based on visibility settings
  const visibleWallets = isVisibilityLoaded 
    ? wallets.filter(wallet => coinVisibility[wallet.network] === true)
    : wallets;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="headlineMedium">Wallet</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconButton 
            icon="logout" 
            onPress={logout} 
            accessibilityLabel="Logout"
            iconColor={theme.colors.error}
          />
          <IconButton 
            icon="cog" 
            size={24} 
            onPress={() => router.push('/(app)/coin-management')} 
          />
        </View>
      </View>

      {isLoading || !isVisibilityLoaded ? (
        <Text>Loading wallets...</Text>
      ) : (
        <ScrollView style={styles.walletList} refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => getWallets()} />}>
          <View style={styles.portfolioContainer}>
            <View style={styles.titleRow}>
              <Text variant="titleMedium">Main Wallet</Text>
              <IconButton
                icon={isBalanceVisible ? 'eye' : 'eye-off'}
                size={22}
                onPress={() => setIsBalanceVisible(!isBalanceVisible)}
                style={styles.eyeIcon}
              />
            </View>
            <Text variant="headlineMedium" style={styles.totalBalance}>
              {isBalanceVisible ? formatCurrency(calculateTotalBalance()) : '******'}
            </Text>
          </View>

          {renderQuickActions()}

          <Divider style={styles.divider} />

          <View style={styles.sectionHeader}>
            <Text variant="titleMedium" style={[styles.sectionTitle, { fontWeight: 'bold' }]}>Crypto</Text>
            <Text variant="bodySmall" style={styles.walletCount}>
              {visibleWallets.length} of {wallets.length} visible
            </Text>
          </View>
          
          {visibleWallets.length === 0 ? (
            <Card style={styles.emptyStateCard}>
              <Card.Content style={{alignItems: 'center'}}>
                <Text style={styles.emptyStateText}>No visible wallets found.</Text>
                <Text style={styles.emptyStateText}>
                  You may have hidden all coins. Go to Coin Management to show some wallets.
                </Text>
                <Button 
                  mode="contained" 
                  onPress={() => router.push('/(app)/coin-management')} 
                  style={styles.createButton}
                >
                  Manage Coins
                </Button>
              </Card.Content>
            </Card>
          ) : (
            <View>
              {visibleWallets.map((wallet) => {
                const coin = ALL_COINS.find((c: any) => c.symbol === wallet.network);
                const price = PRICES[wallet.network as keyof typeof PRICES]?.price || 0;
                const change = PRICES[wallet.network as keyof typeof PRICES]?.change || 0;
                return (
                  <TouchableOpacity
                    key={wallet.id}
                    style={styles.walletRow}
                  >
                    <View style={styles.walletLeft}>
                      <MaterialCommunityIcons
                        name={coin?.icon as any || 'wallet'}
                        size={32}
                        color={coin?.color || theme.colors.primary}
                        style={styles.walletIcon}
                      />
                      <View>
                        <Text variant="titleMedium">{coin?.name || wallet.network}</Text>
                        <Text variant="bodySmall" style={styles.walletSymbol}>{wallet.network}</Text>
                      </View>
                    </View>
                    <View style={styles.walletRight}>
                      <Text variant="titleMedium" style={styles.walletBalance}>
                        {isBalanceVisible ? `${wallet.balance} ${wallet.network}` : '******'}
                      </Text>
                      <Text variant="bodySmall" style={styles.walletRawBalance}>
                        {isBalanceVisible ? formatCurrency(wallet.balance * price) : '******'}
                      </Text>
                      <Text
                        variant="bodySmall"
                        style={{
                          color: change >= 0 ? theme.colors.primary : theme.colors.error,
                          textAlign: 'right',
                        }}
                      >
                        {change >= 0 ? '+' : ''}{change}%
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          <Divider style={styles.divider} />

          {renderRecentTransactions()}
        </ScrollView>
      )}
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
  walletList: {
    flex: 1,
  },
  portfolioContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalBalance: {
    marginTop: 8,
  },
  eyeIcon: {
    marginLeft: 5,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  actionButton: {
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#FF6500',
    borderRadius: 10,
    padding: 5,
    marginBottom: 4,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 0,
  },
  walletCount: {
    opacity: 0.7,
  },
  walletCard: {
    marginBottom: 16,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  address: {
    opacity: 0.7,
    marginVertical: 8,
  },
  walletFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  balance: {
    marginTop: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButton: {
    marginTop: 16,
  },
  logoutButton: {
    margin: 16,
  },
  emptyStateCard: {
    marginVertical: 16,
    padding: 16,
  },
  emptyStateText: {
    marginBottom: 16,
    textAlign: 'center',
  },
  recentTransactions: {
    marginBottom: 16,
  },
  transactionCard: {
    marginBottom: 8,
  },
  transactionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  walletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  walletLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  walletIcon: {
    marginRight: 10,
  },
  walletSymbol: {
    opacity: 0.6,
  },
  walletRight: {
    alignItems: 'flex-end',
    minWidth: 100,
  },
  walletBalance: {
    fontWeight: 'bold',
  },
  walletRawBalance: {
    opacity: 0.7,
    fontSize: 13,
    marginTop: 2,
    marginBottom: 2,
  },
}); 