import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, useTheme, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ALL_COINS } from './coin-management';

export default function SendScreen() {
  const theme = useTheme();
  const router = useRouter();

  const handleSelectCoin = (coinSymbol: string) => {
    router.push({ pathname: '/send-form', params: { coin: coinSymbol } });
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <IconButton icon="arrow-left" size={28} onPress={() => router.back()} />
        <Text variant="headlineMedium" style={styles.headerTitle}>Select Blockchain</Text>
        <View style={{ width: 48 }} />
      </View>
      <View style={styles.coinList}>
        {ALL_COINS.map((c) => (
          <TouchableOpacity
            key={c.symbol}
            style={styles.coinItem}
            onPress={() => handleSelectCoin(c.symbol)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name={c.icon as any} size={32} color={c.color} style={styles.coinIcon} />
            <View>
              <Text style={styles.coinName}>{c.name}</Text>
              <Text style={styles.coinSymbol}>{c.symbol}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
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
  coinList: { marginBottom: 16 },
  coinItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderColor: 'transparent',
    borderWidth: 2,
  },
  coinIcon: { marginRight: 16 },
  coinName: { fontSize: 16, fontWeight: 'bold' },
  coinSymbol: { fontSize: 12, color: '#888' },
}); 