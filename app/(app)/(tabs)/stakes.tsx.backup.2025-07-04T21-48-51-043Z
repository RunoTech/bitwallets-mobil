import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Button, Card, Text, TextInput, useTheme, IconButton, ProgressBar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const STAKING_POOLS = [
  {
    id: 'eth-stake',
    name: 'Ethereum Staking',
    symbol: 'ETH',
    apy: '4.2%',
    totalStaked: '2.5M ETH',
    minStake: '32 ETH',
    icon: 'ethereum',
    color: '#627EEA'
  },
  {
    id: 'sol-stake',
    name: 'Solana Staking',
    symbol: 'SOL',
    apy: '6.8%',
    totalStaked: '450K SOL',
    minStake: '1 SOL',
    icon: 'currency-btc',
    color: '#14F195'
  },
  {
    id: 'matic-stake',
    name: 'Polygon Staking',
    symbol: 'MATIC',
    apy: '8.5%',
    totalStaked: '1.2M MATIC',
    minStake: '100 MATIC',
    icon: 'currency-btc',
    color: '#8247E5'
  }
];

const MY_STAKES = [
  {
    id: '1',
    pool: 'Ethereum Staking',
    amount: '64 ETH',
    rewards: '2.1 ETH',
    apy: '4.2%',
    status: 'active',
    startDate: '2024-01-15'
  },
  {
    id: '2',
    pool: 'Solana Staking',
    amount: '500 SOL',
    rewards: '15.2 SOL',
    apy: '6.8%',
    status: 'active',
    startDate: '2024-02-01'
  }
];

export default function StakesScreen() {
  const theme = useTheme();
  const [selectedPool, setSelectedPool] = useState<string | null>(null);
  const [stakeAmount, setStakeAmount] = useState('');

  const handleStake = () => {
    // TODO: Implement staking logic
    console.log('Staking:', stakeAmount, 'in pool:', selectedPool);
  };

  const handleUnstake = (stakeId: string) => {
    // TODO: Implement unstaking logic
    console.log('Unstaking:', stakeId);
  };

  const totalStakedValue = MY_STAKES.reduce((total, stake) => {
    // Simplified calculation
    return total + parseFloat(stake.amount.split(' ')[0]);
  }, 0);

  const totalRewards = MY_STAKES.reduce((total, stake) => {
    return total + parseFloat(stake.rewards.split(' ')[0]);
  }, 0);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text variant="headlineMedium">Staking</Text>
        <IconButton icon="history" size={24} onPress={() => {}} />
      </View>

      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>My Staking Summary</Text>
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text variant="headlineSmall">{totalStakedValue}</Text>
              <Text variant="bodySmall">Total Staked</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineSmall">{totalRewards}</Text>
              <Text variant="bodySmall">Total Rewards</Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineSmall">5.2%</Text>
              <Text variant="bodySmall">Avg APY</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Text variant="titleMedium" style={styles.sectionTitle}>Available Staking Pools</Text>
      {STAKING_POOLS.map((pool) => (
        <Card key={pool.id} style={styles.poolCard}>
          <Card.Content>
            <View style={styles.poolHeader}>
              <View style={styles.poolInfo}>
                <MaterialCommunityIcons name={pool.icon as any} size={32} color={pool.color} />
                <View style={styles.poolDetails}>
                  <Text variant="titleMedium">{pool.name}</Text>
                  <Text variant="bodySmall">{pool.symbol}</Text>
                </View>
              </View>
              <View style={styles.poolStats}>
                <Text variant="titleLarge" style={{ color: theme.colors.primary }}>
                  {pool.apy}
                </Text>
                <Text variant="bodySmall">APY</Text>
              </View>
            </View>
            
            <View style={styles.poolDetails}>
              <View style={styles.detailRow}>
                <Text variant="bodyMedium">Total Staked:</Text>
                <Text variant="bodyMedium">{pool.totalStaked}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text variant="bodyMedium">Min Stake:</Text>
                <Text variant="bodyMedium">{pool.minStake}</Text>
              </View>
            </View>

            <Button 
              mode="contained" 
              onPress={() => setSelectedPool(pool.id)}
              style={styles.stakeButton}
            >
              Stake {pool.symbol}
            </Button>
          </Card.Content>
        </Card>
      ))}

      <Text variant="titleMedium" style={styles.sectionTitle}>My Active Stakes</Text>
      {MY_STAKES.map((stake) => (
        <Card key={stake.id} style={styles.stakeCard}>
          <Card.Content>
            <View style={styles.stakeHeader}>
              <View>
                <Text variant="titleMedium">{stake.pool}</Text>
                <Text variant="bodySmall">Started: {stake.startDate}</Text>
              </View>
              <View style={styles.stakeStats}>
                <Text variant="titleMedium">{stake.amount}</Text>
                <Text variant="bodySmall">Staked</Text>
              </View>
            </View>
            
            <View style={styles.stakeDetails}>
              <View style={styles.detailRow}>
                <Text variant="bodyMedium">Rewards Earned:</Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.primary }}>
                  {stake.rewards}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text variant="bodyMedium">APY:</Text>
                <Text variant="bodyMedium">{stake.apy}</Text>
              </View>
            </View>

            <View style={styles.stakeActions}>
              <Button mode="outlined" onPress={() => {}} style={styles.actionButton}>
                Claim Rewards
              </Button>
              <Button 
                mode="outlined" 
                onPress={() => handleUnstake(stake.id)}
                style={styles.actionButton}
              >
                Unstake
              </Button>
            </View>
          </Card.Content>
        </Card>
      ))}

      {/* Staking Modal would go here */}
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
  summaryCard: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  poolCard: {
    marginBottom: 16,
  },
  poolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  poolInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  poolDetails: {
    marginLeft: 12,
  },
  poolStats: {
    alignItems: 'flex-end',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stakeButton: {
    marginTop: 16,
  },
  stakeCard: {
    marginBottom: 12,
  },
  stakeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  stakeStats: {
    alignItems: 'flex-end',
  },
  stakeDetails: {
    marginBottom: 16,
  },
  stakeActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
}); 