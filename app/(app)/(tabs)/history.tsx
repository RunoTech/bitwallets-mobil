import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Text, useTheme, IconButton } from 'react-native-paper';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TRANSACTION_HISTORY = [
  { id: '1', type: 'send', amount: '-0.5 ETH', date: '2024-03-15', status: 'confirmed', to: '0x1234...abcd', from: '0xabcd...efgh', change: '-2.5%' },
  { id: '6', type: 'send', amount: '-0.1 ETH', date: '2024-03-15', status: 'confirmed', to: '0x9999...8888', from: '0xabcd...efgh', change: '-0.5%' },
  { id: '2', type: 'receive', amount: '+0.25 BTC', date: '2024-03-14', status: 'confirmed', to: '0xyzaa...bbcc', from: '0xqrst...uvwx', change: '+1.2%' },
  { id: '7', type: 'receive', amount: '+0.05 BTC', date: '2024-03-14', status: 'confirmed', to: '0xyzaa...bbcc', from: '0x1111...2222', change: '+0.3%' },
  { id: '3', type: 'swap', amount: '100 SOL', date: '2024-03-13', status: 'confirmed', to: '0xffff...gggg', from: '0xdddd...eeee', change: '0.0%' },
  { id: '4', type: 'stake', amount: '32 ETH', date: '2024-03-12', status: 'confirmed', to: 'Staking Pool', from: '0xaaaa...bbbb', change: '+0.5%' },
  { id: '5', type: 'unstake', amount: '500 SOL', date: '2024-03-11', status: 'pending', to: '0xeeee...ffff', from: 'Staking Pool', change: '-0.3%' }
];

function getTypeIcon(type: string) {
  switch (type) {
    case 'send': return 'arrow-up';
    case 'receive': return 'arrow-down';
    case 'swap': return 'swap-horizontal';
    case 'stake': return 'lock';
    case 'unstake': return 'lock-open';
    default: return 'circle';
  }
}

function getBalanceColor(type: string, theme: any) {
  if (type === 'receive') return '#4CAF50'; // green
  if (type === 'send') return theme.colors.error;
  return theme.colors.onSurface;
}

function groupByDate(transactions: typeof TRANSACTION_HISTORY) {
  return transactions.reduce((acc, tx) => {
    if (!acc[tx.date]) acc[tx.date] = [];
    acc[tx.date].push(tx);
    return acc;
  }, {} as Record<string, typeof TRANSACTION_HISTORY>);
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function HistoryScreen() {
  const theme = useTheme();
  const grouped = groupByDate(TRANSACTION_HISTORY);
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (date: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => ({ ...prev, [date]: !prev[date] }));
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>  
      <View style={styles.header}>
        <Text variant="headlineMedium">Transaction History</Text>
      </View>
      {sortedDates.map(date => (
        <View key={date} style={styles.daySection}>
          <TouchableOpacity onPress={() => toggleExpand(date)} activeOpacity={0.7} style={styles.dropdownHeader}>
            <Text style={styles.dateLabel}>{formatDate(date)}</Text>
            <IconButton
              icon={expanded[date] ? 'chevron-up' : 'chevron-down'}
              size={22}
              iconColor={'#FF6F00'}
              style={styles.chevron}
            />
          </TouchableOpacity>
          {expanded[date] && (
            <View style={styles.dropdownContent}>
              {grouped[date].map((tx) => {
                let directionLabel = '';
                let address = '';
                if (tx.type === 'send' || tx.type === 'swap' || tx.type === 'stake') {
                  directionLabel = 'To';
                  address = tx.to;
                } else if (tx.type === 'receive' || tx.type === 'unstake') {
                  directionLabel = 'From';
                  address = tx.from;
                }
                return (
                  <View key={tx.id} style={styles.txRow}>
                    <View style={styles.iconCircle}>
                      <IconButton
                        icon={getTypeIcon(tx.type)}
                        size={20}
                        iconColor={'#fff'}
                        style={styles.iconButton}
                      />
                    </View>
                    <View style={styles.info}>
                      <Text variant="bodyMedium" style={styles.txType}>
                        {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                      </Text>
                      {directionLabel && (
                        <Text variant="bodySmall" style={styles.txAddress}>
                          {directionLabel}: <Text style={styles.addressMono}>{address}</Text>
                        </Text>
                      )}
                    </View>
                    <View style={styles.right}>
                      <Text
                        variant="bodyMedium"
                        style={[styles.txAmount, { color: getBalanceColor(tx.type, theme) }]}
                      >
                        {tx.amount}
                      </Text>
                      <Text variant="bodySmall" style={styles.txChange}>{tx.change}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 16,
  },
  header: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  daySection: {
    marginBottom: 0,
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dateLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
  },
  chevron: {
    margin: 0,
  },
  dropdownContent: {
    paddingHorizontal: 8,
    paddingBottom: 8,
    backgroundColor: 'transparent',
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'relative',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6F00',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconButton: {
    margin: 0,
  },
  info: {
    flex: 1,
    marginLeft: 0,
  },
  txType: {
    fontWeight: 'bold',
  },
  txAddress: {
    color: '#888',
    marginTop: 2,
  },
  addressMono: {
    fontFamily: 'monospace',
    color: '#888',
  },
  right: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  txAmount: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  txChange: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
}); 