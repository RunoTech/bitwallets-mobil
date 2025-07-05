"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportLogs = exports.clearLogs = exports.getLogs = exports.showLogs = exports.logWalletError = exports.logAuthError = exports.logNetworkError = exports.errorLogger = void 0;
const async_storage_1 = require("@react-native-async-storage/async-storage");
const react_native_1 = require("react-native");
// Error log storage key
const ERROR_LOG_KEY = 'bitwallets_error_log';
const MAX_LOG_ENTRIES = 100;
class ErrorLogger {
    constructor() {
        this.logs = [];
    }
    // Add error to log
    async logError(type, message, details, url, status) {
        const entry = {
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
    showErrorToUser(message, details) {
        const fullMessage = details
            ? `${message}\n\nDetails: ${JSON.stringify(details, null, 2)}`
            : message;
        react_native_1.Alert.alert('Error', fullMessage, [
            { text: 'OK', style: 'default' },
            { text: 'View Logs', onPress: () => this.showLogs() }
        ]);
    }
    // Save logs to AsyncStorage
    async saveLogs() {
        try {
            await async_storage_1.default.setItem(ERROR_LOG_KEY, JSON.stringify(this.logs));
        }
        catch (error) {
            console.error('Failed to save error logs:', error);
        }
    }
    // Load logs from AsyncStorage
    async loadLogs() {
        try {
            const stored = await async_storage_1.default.getItem(ERROR_LOG_KEY);
            if (stored) {
                this.logs = JSON.parse(stored);
            }
        }
        catch (error) {
            console.error('Failed to load error logs:', error);
        }
    }
    // Get all logs
    getLogs() {
        return [...this.logs];
    }
    // Get logs by type
    getLogsByType(type) {
        return this.logs.filter(log => log.type === type);
    }
    // Get recent logs
    getRecentLogs(count = 10) {
        return this.logs.slice(-count);
    }
    // Clear logs
    async clearLogs() {
        this.logs = [];
        await async_storage_1.default.removeItem(ERROR_LOG_KEY);
    }
    // Show logs to user
    async showLogs() {
        const recentLogs = this.getRecentLogs(5);
        if (recentLogs.length === 0) {
            react_native_1.Alert.alert('Logs', 'No recent errors logged.');
            return;
        }
        const logText = recentLogs
            .map(log => `[${log.timestamp}]\n${log.type.toUpperCase()}: ${log.message}`)
            .join('\n\n');
        react_native_1.Alert.alert('Recent Error Logs', logText, [
            { text: 'OK', style: 'default' },
            { text: 'Clear Logs', onPress: () => this.clearLogs() }
        ]);
    }
    // Export logs as text
    exportLogs() {
        return this.logs
            .map(log => `[${log.timestamp}] ${log.type.toUpperCase()}: ${log.message}`)
            .join('\n');
    }
    // Network error specific logging
    async logNetworkError(message, url, status, details) {
        await this.logError('network', message, details, url, status);
    }
    // Auth error specific logging
    async logAuthError(message, details) {
        await this.logError('auth', message, details);
    }
    // Wallet error specific logging
    async logWalletError(message, details) {
        await this.logError('wallet', message, details);
    }
}
// Create singleton instance
exports.errorLogger = new ErrorLogger();
// Initialize logger on app start
exports.errorLogger.loadLogs();
// Export convenience functions
const logNetworkError = (message, url, status, details) => exports.errorLogger.logNetworkError(message, url, status, details);
exports.logNetworkError = logNetworkError;
const logAuthError = (message, details) => exports.errorLogger.logAuthError(message, details);
exports.logAuthError = logAuthError;
const logWalletError = (message, details) => exports.errorLogger.logWalletError(message, details);
exports.logWalletError = logWalletError;
const showLogs = () => exports.errorLogger.showLogs();
exports.showLogs = showLogs;
const getLogs = () => exports.errorLogger.getLogs();
exports.getLogs = getLogs;
const clearLogs = () => exports.errorLogger.clearLogs();
exports.clearLogs = clearLogs;
const exportLogs = () => exports.errorLogger.exportLogs();
exports.exportLogs = exportLogs;
