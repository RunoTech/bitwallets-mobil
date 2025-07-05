import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  TextInput
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MnemonicService, QuizData } from '../services/mnemonic';
import { theme } from '../theme';
import { useAuth } from '../context/auth';

interface QuizWord {
  index: number;
  word: string;
  isSelected: boolean;
}

export default function MnemonicVerificationScreen() {
  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [verifying, setVerifying] = useState(false);
  const [mnemonic, setMnemonic] = useState<string>('');
  const { completeMnemonicSetup } = useAuth();

  useEffect(() => {
    initializeQuiz();
  }, []);

  const initializeQuiz = async () => {
    try {
      setLoading(true);
      
      // Get mnemonic from global storage (in real app, use secure storage)
      const storedMnemonic = (global as any).mnemonicForVerification;
      if (!storedMnemonic) {
        Alert.alert('Error', 'No mnemonic found. Please go back and generate a new one.');
        router.back();
        return;
      }
      
      setMnemonic(storedMnemonic);
      
      // Generate quiz
      const response = await MnemonicService.generateQuiz(storedMnemonic);
      
      if (response.success && response.data) {
        setQuizData(response.data);
      } else {
        Alert.alert('Error', response.error || 'Failed to generate quiz');
      }
    } catch (error) {
      console.error('Error initializing quiz:', error);
      Alert.alert('Error', 'Failed to initialize quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleWordSelection = (word: string, index: number) => {
    if (selectedWords.length >= 3) return; // Only allow 3 selections
    
    setSelectedWords(prev => [...prev, word]);
    setSelectedIndices(prev => [...prev, index]);
  };

  const handleWordDeselection = (index: number) => {
    setSelectedWords(prev => prev.filter((_, i) => i !== index));
    setSelectedIndices(prev => prev.filter((_, i) => i !== index));
  };

  const handleVerify = async () => {
    if (selectedWords.length !== 3) {
      Alert.alert('Error', 'Please select exactly 3 words');
      return;
    }

    try {
      setVerifying(true);
      const response = await MnemonicService.verifyMnemonic(
        mnemonic,
        selectedWords,
        selectedIndices
      );

      if (response.success && response.data?.verified) {
        Alert.alert(
          'Success!',
          'Your mnemonic has been verified successfully. Your wallet is now ready to use.',
          [
            {
              text: 'Continue',
              onPress: async () => {
                try {
                  // Complete mnemonic setup and authenticate user with the verified mnemonic
                  await completeMnemonicSetup(mnemonic);
                  // Clear stored mnemonic after successful setup
                  (global as any).mnemonicForVerification = null;
                  // Navigate to main app
                  router.replace('/(app)' as any);
                } catch (error) {
                  console.error('Failed to complete mnemonic setup:', error);
                  Alert.alert('Error', 'Failed to complete setup. Please try again.');
                }
              }
            }
          ]
        );
      } else {
        Alert.alert(
          'Verification Failed',
          'The words you selected do not match your mnemonic. Please try again.',
          [
            {
              text: 'Try Again',
              onPress: () => {
                setSelectedWords([]);
                setSelectedIndices([]);
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error verifying mnemonic:', error);
      Alert.alert('Error', 'Failed to verify mnemonic');
    } finally {
      setVerifying(false);
    }
  };

  const renderQuizWords = () => {
    if (!quizData) return null;

    const words = mnemonic.split(' ');
    const quizWords: QuizWord[] = words.map((word, index) => ({
      index,
      word,
      isSelected: selectedIndices.includes(index)
    }));

    // Shuffle the words for the quiz
    const shuffledWords = [...quizWords].sort(() => Math.random() - 0.5);

    return (
      <View style={styles.wordsGrid}>
        {shuffledWords.map((quizWord, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.wordButton,
              quizWord.isSelected && styles.wordButtonSelected
            ]}
            onPress={() => {
              if (quizWord.isSelected) {
                handleWordDeselection(selectedIndices.indexOf(quizWord.index));
              } else {
                handleWordSelection(quizWord.word, quizWord.index);
              }
            }}
            disabled={quizWord.isSelected || selectedWords.length >= 3}
          >
            <Text style={[
              styles.wordButtonText,
              quizWord.isSelected && styles.wordButtonTextSelected
            ]}>
              {quizWord.word}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderSelectedWords = () => {
    return (
      <View style={styles.selectedWordsContainer}>
        <Text style={styles.selectedWordsTitle}>Selected Words:</Text>
        <View style={styles.selectedWordsList}>
          {selectedWords.map((word, index) => (
            <View key={index} style={styles.selectedWordItem}>
              <Text style={styles.selectedWordNumber}>{selectedIndices[index] + 1}</Text>
              <Text style={styles.selectedWordText}>{word}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleWordDeselection(index)}
              >
                <Ionicons name="close-circle" size={20} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Preparing verification quiz...</Text>
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
        <Text style={styles.headerTitle}>Verify Recovery Phrase</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.instructionContainer}>
          <Ionicons name="shield-checkmark" size={24} color={theme.colors.primary} />
          <Text style={styles.instructionTitle}>Security Verification</Text>
          <Text style={styles.instructionText}>
            To ensure you've safely written down your recovery phrase, please select the words in the correct order as they appear in your phrase.
          </Text>
        </View>

        {selectedWords.length > 0 && renderSelectedWords()}

        <View style={styles.quizContainer}>
          <Text style={styles.quizTitle}>
            Select the words in order: {selectedWords.length}/3
          </Text>
          {renderQuizWords()}
        </View>

        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Tips:</Text>
          <View style={styles.tipItem}>
            <Ionicons name="information-circle" size={16} color={theme.colors.primary} />
            <Text style={styles.tipText}>Words must be selected in the correct order</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="information-circle" size={16} color={theme.colors.primary} />
            <Text style={styles.tipText}>You can deselect words by tapping them again</Text>
          </View>
          <View style={styles.tipItem}>
            <Ionicons name="information-circle" size={16} color={theme.colors.primary} />
            <Text style={styles.tipText}>Take your time and be careful</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.verifyButton,
            selectedWords.length !== 3 && styles.verifyButtonDisabled
          ]}
          onPress={handleVerify}
          disabled={selectedWords.length !== 3 || verifying}
        >
          {verifying ? (
            <ActivityIndicator size="small" color={theme.colors.onPrimary} />
          ) : (
            <Text style={styles.verifyButtonText}>Verify Recovery Phrase</Text>
          )}
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
  instructionContainer: {
    backgroundColor: theme.colors.primaryContainer,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onPrimaryContainer,
    marginTop: 8,
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: theme.colors.onPrimaryContainer,
    lineHeight: 20,
    textAlign: 'center',
  },
  selectedWordsContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  selectedWordsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 12,
  },
  selectedWordsList: {
    gap: 8,
  },
  selectedWordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: 12,
  },
  selectedWordNumber: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.onSurfaceVariant,
    marginRight: 8,
    minWidth: 20,
  },
  selectedWordText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.onSurface,
    flex: 1,
  },
  removeButton: {
    padding: 4,
  },
  quizContainer: {
    marginBottom: 24,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 16,
  },
  wordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  wordButton: {
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    minWidth: 80,
    alignItems: 'center',
  },
  wordButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  wordButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.onSurface,
  },
  wordButtonTextSelected: {
    color: theme.colors.onPrimary,
  },
  tipsContainer: {
    marginBottom: 24,
  },
  tipsTitle: {
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
  verifyButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  verifyButtonDisabled: {
    backgroundColor: theme.colors.outline,
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onPrimary,
  },
}); 