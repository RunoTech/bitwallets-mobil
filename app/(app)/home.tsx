import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';

const Home: React.FC = () => {
  const router = useRouter();

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

  return (
    <View>
      {renderQuickActions()}
    </View>
  );
};

const styles = {
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  actionButton: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
};

export default Home; 