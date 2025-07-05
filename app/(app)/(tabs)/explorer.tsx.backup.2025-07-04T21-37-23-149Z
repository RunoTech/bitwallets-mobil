import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Button, Card, Text, TextInput, useTheme, IconButton, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const RECENT_TRANSACTIONS = [
  {
    id: '0x1234...5678',
    type: 'send',
    amount: '0.5 ETH',
    from: '0xabcd...efgh',
    to: '0xijkl...mnop',
    time: '2 min ago',
    status: 'confirmed',
    network: 'Ethereum'
  },
  {
    id: '0x8765...4321',
    type: 'receive',
    amount: '0.25 BTC',
    from: '0xqrst...uvwx',
    to: '0xyzaa...bbcc',
    time: '15 min ago',
    status: 'confirmed',
    network: 'Bitcoin'
  },
  {
    id: '0x9999...8888',
    type: 'swap',
    amount: '100 SOL',
    from: '0xdddd...eeee',
    to: '0xffff...gggg',
    time: '1 hour ago',
    status: 'pending',
    network: 'Solana'
  }
];

const NETWORKS = ['All', 'Ethereum', 'Bitcoin', 'Solana', 'Polygon', 'Avalanche'];

export default function ExplorerScreen() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('All');

  const handleSearch = () => {
    // TODO: Implement blockchain explorer search
    console.log('Searching for:', searchQuery);
  };

  const getStatusColor = (status: string) => {
    return status === 'confirmed' ? theme.colors.primary : theme.colors.error;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'send': return 'arrow-up';
      case 'receive': return 'arrow-down';
      case 'swap': return 'swap-horizontal';
      default: return 'circle';
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="headlineMedium">Blockchain Explorer</Text>
        <IconButton icon="filter" size={24} onPress={() => {}} />
      </View>

      <Card style={styles.searchCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>Search Transactions</Text>
          <View style={styles.searchContainer}>
            <TextInput
              label="Transaction Hash, Address, or Block"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
              placeholder="0x1234... or 0xabcd..."
            />
            <Button mode="contained" onPress={handleSearch} style={styles.searchButton}>
              Search
            </Button>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.networkFilter}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {NETWORKS.map((network) => (
            <Chip
              key={network}
              selected={selectedNetwork === network}
              onPress={() => setSelectedNetwork(network)}
              style={styles.networkChip}
              mode="outlined"
            >
              {network}
            </Chip>
          ))}
        </ScrollView>
      </View>

      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <MaterialCommunityIcons name="chart-line" size={24} color={theme.colors.primary} />
            <Text variant="titleLarge">$2.4T</Text>
            <Text variant="bodySmall">Total Market Cap</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <MaterialCommunityIcons name="swap-horizontal" size={24} color={theme.colors.primary} />
            <Text variant="titleLarge">1.2M</Text>
            <Text variant="bodySmall">Daily Transactions</Text>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <MaterialCommunityIcons name="account-group" size={24} color={theme.colors.primary} />
            <Text variant="titleLarge">45M</Text>
            <Text variant="bodySmall">Active Wallets</Text>
          </Card.Content>
        </Card>
      </View>

      <Text variant="titleMedium" style={styles.sectionTitle}>Recent Transactions</Text>
      {RECENT_TRANSACTIONS.map((tx) => (
        <Card key={tx.id} style={styles.transactionCard}>
          <Card.Content>
            <View style={styles.transactionHeader}>
              <View style={styles.transactionLeft}>
                <IconButton
                  icon={getTypeIcon(tx.type)}
                  size={24}
                  iconColor={getStatusColor(tx.status)}
                />
                <View>
                  <Text variant="bodyMedium" style={styles.txId}>{tx.id}</Text>
                  <Text variant="bodySmall">{tx.network}</Text>
                </View>
              </View>
              <View style={styles.transactionRight}>
                <Text variant="bodyMedium" style={{ color: getStatusColor(tx.status) }}>
                  {tx.amount}
                </Text>
                <Text variant="bodySmall">{tx.time}</Text>
              </View>
            </View>
            <View style={styles.transactionDetails}>
              <Text variant="bodySmall">From: {tx.from}</Text>
              <Text variant="bodySmall">To: {tx.to}</Text>
            </View>
          </Card.Content>
        </Card>
      ))}
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
  searchCard: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginRight: 12,
  },
  searchButton: {
    minWidth: 80,
  },
  networkFilter: {
    marginBottom: 24,
  },
  networkChip: {
    marginRight: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
  },
  statContent: {
    alignItems: 'center',
    padding: 12,
  },
  transactionCard: {
    marginBottom: 12,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  txId: {
    fontWeight: 'bold',
  },
  transactionDetails: {
    marginTop: 8,
  },
}); 