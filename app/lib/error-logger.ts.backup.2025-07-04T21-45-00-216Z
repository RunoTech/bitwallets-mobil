import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Error log storage key
const ERROR_LOG_KEY = 'bitwallets_error_log';
const MAX_LOG_ENTRIES = 100;

export interface ErrorLogEntry {
  timestamp: string;
  type: 'network' | 'auth' | 'wallet' | 'general';
  message: string;
  details?: any;
  stack?: string;
  url?: string;
  status?: number;
}

class ErrorLogger {
  private logs: ErrorLogEntry[] = [];

  // Add error to log
  async logError(
    type: ErrorLogEntry['type'],
    message: string,
    details?: any,
    url?: string,
    status?: number
  ) {
    const entry: ErrorLogEntry = {
      timestamp: new Date().toISOString(),
      type,
      message,
      details,
      stack: new Error().stack,
      url,
      status,
    };

    this.logs.push(entry);
    
    // Keep only the last MAX_LOG_ENTRIES
    if (this.logs.length > MAX_LOG_ENTRIES) {
      this.logs = this.logs.slice(-MAX_LOG_ENTRIES);
    }

    // Save to AsyncStorage
    await this.saveLogs();
    
    // Show error to user in development or when critical
    if (type === 'network' || type === 'auth') {
      this.showErrorToUser(message, details);
    }
  }

  // Show error to user
  private showErrorToUser(message: string, details?: any) {
    const fullMessage = details 
      ? `${message}\n\nDetails: ${JSON.stringify(details, null, 2)}`
      : message;
    
    Alert.alert(
      'Error',
      fullMessage,
      [
        { text: 'OK', style: 'default' },
        { text: 'View Logs', onPress: () => this.showLogs() }
      ]
    );
  }

  // Save logs to AsyncStorage
  private async saveLogs() {
    try {
      await AsyncStorage.setItem(ERROR_LOG_KEY, JSON.stringify(this.logs));
    } catch (error) {
      console.error('Failed to save error logs:', error);
    }
  }

  // Load logs from AsyncStorage
  async loadLogs() {
    try {
      const stored = await AsyncStorage.getItem(ERROR_LOG_KEY);
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load error logs:', error);
    }
  }

  // Get all logs
  getLogs(): ErrorLogEntry[] {
    return [...this.logs];
  }

  // Get logs by type
  getLogsByType(type: ErrorLogEntry['type']): ErrorLogEntry[] {
    return this.logs.filter(log => log.type === type);
  }

  // Get recent logs
  getRecentLogs(count: number = 10): ErrorLogEntry[] {
    return this.logs.slice(-count);
  }

  // Clear logs
  async clearLogs() {
    this.logs = [];
    await AsyncStorage.removeItem(ERROR_LOG_KEY);
  }

  // Show logs to user
  async showLogs() {
    const recentLogs = this.getRecentLogs(5);
    if (recentLogs.length === 0) {
      Alert.alert('Logs', 'No recent errors logged.');
      return;
    }

    const logText = recentLogs
      .map(log => `[${log.timestamp}]\n${log.type.toUpperCase()}: ${log.message}`)
      .join('\n\n');

    Alert.alert(
      'Recent Error Logs',
      logText,
      [
        { text: 'OK', style: 'default' },
        { text: 'Clear Logs', onPress: () => this.clearLogs() }
      ]
    );
  }

  // Export logs as text
  exportLogs(): string {
    return this.logs
      .map(log => `[${log.timestamp}] ${log.type.toUpperCase()}: ${log.message}`)
      .join('\n');
  }

  // Network error specific logging
  async logNetworkError(message: string, url?: string, status?: number, details?: any) {
    await this.logError('network', message, details, url, status);
  }

  // Auth error specific logging
  async logAuthError(message: string, details?: any) {
    await this.logError('auth', message, details);
  }

  // Wallet error specific logging
  async logWalletError(message: string, details?: any) {
    await this.logError('wallet', message, details);
  }
}

// Create singleton instance
export const errorLogger = new ErrorLogger();

// Initialize logger on app start
errorLogger.loadLogs();

// Export convenience functions
export const logNetworkError = (message: string, url?: string, status?: number, details?: any) => 
  errorLogger.logNetworkError(message, url, status, details);

export const logAuthError = (message: string, details?: any) => 
  errorLogger.logAuthError(message, details);

export const logWalletError = (message: string, details?: any) => 
  errorLogger.logWalletError(message, details);

export const showLogs = () => errorLogger.showLogs();
export const getLogs = () => errorLogger.getLogs();
export const clearLogs = () => errorLogger.clearLogs();
export const exportLogs = () => errorLogger.exportLogs(); 