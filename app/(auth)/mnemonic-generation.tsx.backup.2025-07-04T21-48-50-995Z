import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  SafeAreaView
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MnemonicService, MnemonicData } from '../services/mnemonic';
import { theme } from '../theme';

const { width } = Dimensions.get('window');

export default function MnemonicGenerationScreen() {
  const [mnemonicData, setMnemonicData] = useState<MnemonicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateMnemonic();
  }, []);

  const generateMnemonic = async () => {
    try {
      setLoading(true);
      const response = await MnemonicService.generateMnemonic();
      
      if (response.success && response.data) {
        setMnemonicData(response.data);
      } else {
        Alert.alert('Error', response.error || 'Failed to generate mnemonic');
      }
    } catch (error) {
      console.error('Error generating mnemonic:', error);
      Alert.alert('Error', 'Failed to generate mnemonic');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMnemonic = async () => {
    if (mnemonicData) {
      await Clipboard.setStringAsync(mnemonicData.mnemonic);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      Alert.alert('Copied', 'Mnemonic copied to clipboard');
    }
  };

  const handleReveal = () => {
    setRevealed(true);
  };

  const handleContinue = () => {
    if (!revealed) return;
    // Store mnemonic data for verification screen
    if (mnemonicData) {
      (global as any).mnemonicForVerification = mnemonicData.mnemonic;
    }
    router.push('/(auth)/mnemonic-verification' as any);
  };

  const renderMnemonicWords = () => {
    if (!mnemonicData) return null;
    if (!revealed) {
      return (
        <View style={styles.hiddenMnemonicContainer}>
          <Text style={styles.hiddenMnemonicText}>Tap 'Reveal' to show your recovery phrase</Text>
        </View>
      );
    }
    const words = mnemonicData.mnemonic.split(' ');
    const rows = [];
    for (let i = 0; i < words.length; i += 3) {
      const rowWords = words.slice(i, i + 3);
      rows.push(
        <View key={i} style={styles.wordRow}>
          {rowWords.map((word, index) => (
            <View key={i + index} style={styles.wordContainer}>
              <Text style={styles.wordNumber}>{i + index + 1}</Text>
              <Text style={styles.wordText}>{word}</Text>
            </View>
          ))}
        </View>
      );
    }
    return rows;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Generating your mnemonic...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.onBackground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Backup Wallet</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.warningContainer}>
          <Ionicons name="warning" size={24} color={theme.colors.error} />
          <Text style={styles.warningTitle}>Important Security Notice</Text>
          <Text style={styles.warningText}>
            Write down these 24 words in a secure location. Anyone with access to these words can access your wallet and funds.
          </Text>
        </View>

        <View style={styles.mnemonicContainer}>
          <View style={styles.mnemonicHeader}>
            <Text style={styles.mnemonicTitle}>Your Recovery Phrase</Text>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={handleCopyMnemonic}
              disabled={!revealed}
            >
              <Ionicons 
                name={copied ? "checkmark" : "copy-outline"} 
                size={20} 
                color={theme.colors.primary} 
              />
            </TouchableOpacity>
          </View>
          <View style={styles.wordsContainer}>
            {renderMnemonicWords()}
          </View>
          {!revealed && (
            <TouchableOpacity style={styles.revealButton} onPress={handleReveal}>
              <Text style={styles.revealButtonText}>Reveal</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.securityTips}>
          <Text style={styles.securityTitle}>Security Tips:</Text>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary} />
            <Text style={styles.tipText}>Write down on paper, not digitally</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary} />
            <Text style={styles.tipText}>Store in a safe, fireproof location</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary} />
            <Text style={styles.tipText}>Never share with anyone</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary} />
            <Text style={styles.tipText}>Consider multiple backup locations</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, !revealed && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!revealed}
        >
          <Text style={styles.continueButtonText}>
            I Have Written Down My Phrase
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onBackground,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
  },
  warningContainer: {
    backgroundColor: theme.colors.errorContainer,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    marginBottom: 24,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.error,
    marginTop: 8,
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 20,
  },
  mnemonicContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  mnemonicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mnemonicTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  copyButton: {
    padding: 8,
  },
  wordsContainer: {
    gap: 12,
  },
  wordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wordContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
  },
  wordNumber: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.onSurfaceVariant,
    marginRight: 8,
    minWidth: 20,
  },
  wordText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.onSurface,
    flex: 1,
  },
  hiddenMnemonicContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  hiddenMnemonicText: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
    fontStyle: 'italic',
  },
  revealButton: {
    marginTop: 16,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  revealButtonText: {
    color: theme.colors.onPrimary,
    fontWeight: '600',
    fontSize: 16,
  },
  securityTips: {
    marginBottom: 24,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginLeft: 8,
    flex: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outline,
  },
  continueButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: theme.colors.outline,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onPrimary,
  },
}); 