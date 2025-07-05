"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentBaseUrl = exports.initializeCsrfToken = exports.fetchCsrfToken = void 0;
const axios_1 = require("axios");
const async_storage_1 = require("@react-native-async-storage/async-storage");
const error_logger_1 = require("./error-logger");
// Production backend URL
const BASE_URL = 'http://207.154.200.212:3000/api';
// Create axios instance with production configuration
const plainAxios = axios_1.default.create({
    baseURL: BASE_URL,
    timeout: 30000, // 30 seconds timeout
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'BitWallets/1.0.0',
    },
});
// Request interceptor to add common headers and CSRF token
plainAxios.interceptors.request.use(async (config) => {
    console.log(`Making request to: ${config.method?.toUpperCase()} ${config.url}`);
    // Add device-specific headers
    config.headers['X-Device-Type'] = 'mobile';
    config.headers['X-Platform'] = 'react-native';
    // Add CSRF token if available
    try {
        const csrfToken = await async_storage_1.default.getItem('csrfToken');
        if (csrfToken) {
            config.headers['X-CSRF-Token'] = csrfToken;
        }
    }
    catch (error) {
        console.log('Could not get CSRF token:', error);
        (0, error_logger_1.logAuthError)('Failed to get CSRF token from storage', { error: error.message });
    }
    // Add Authorization header if auth_token is available
    try {
        const authToken = await async_storage_1.default.getItem('auth_token');
        if (authToken) {
            config.headers['Authorization'] = `Bearer ${authToken}`;
        }
    }
    catch (error) {
        console.log('Could not get auth token:', error);
        (0, error_logger_1.logAuthError)('Failed to get auth token from storage', { error: error.message });
    }
    return config;
}, (error) => {
    console.error('Request interceptor error:', error);
    (0, error_logger_1.logNetworkError)('Request interceptor failed', undefined, undefined, { error: error.message });
    return Promise.reject(error);
});
// Response interceptor for better error handling
plainAxios.interceptors.response.use((response) => {
    console.log(`Response received: ${response.status} ${response.config.url}`);
    return response;
}, async (error) => {
    console.error('Response error:', error.message);
    // Log the error with details
    const errorDetails = {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
        method: error.config?.method,
    };
    (0, error_logger_1.logNetworkError)(`Network request failed: ${error.message}`, error.config?.url, error.response?.status, errorDetails);
    // Handle CSRF token errors
    if (error.response?.status === 403 && error.response?.data?.message?.includes('CSRF')) {
        console.log('CSRF token error detected, fetching new token...');
        (0, error_logger_1.logAuthError)('CSRF token error detected, attempting to fetch new token');
        try {
            const newToken = await (0, exports.fetchCsrfToken)();
            if (newToken) {
                // Retry the original request with new token
                const originalRequest = error.config;
                originalRequest.headers['X-CSRF-Token'] = newToken;
                return plainAxios(originalRequest);
            }
        }
        catch (csrfError) {
            console.error('Failed to fetch new CSRF token:', csrfError);
            (0, error_logger_1.logAuthError)('Failed to fetch new CSRF token', { error: csrfError.message });
        }
    }
    if (error.response) {
        console.error('Error response:', error.response.status, error.response.data);
    }
    else if (error.request) {
        console.error('Network error - no response received');
        (0, error_logger_1.logNetworkError)('No response received from server', error.config?.url);
    }
    return Promise.reject(error);
});
// Fetch CSRF token from the server
const fetchCsrfToken = async (retries = 3) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`Fetching CSRF token attempt ${attempt}/${retries}...`);
            const response = await fetch(`${BASE_URL}/csrf-token`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                const token = data.csrfToken;
                if (token) {
                    // Store the token
                    await async_storage_1.default.setItem('csrfToken', token);
                    console.log('CSRF token fetched and stored successfully');
                    return token;
                }
                else {
                    throw new Error('No CSRF token in response');
                }
            }
            else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        }
        catch (error) {
            console.error(`CSRF token fetch attempt ${attempt} failed:`, error.message);
            (0, error_logger_1.logAuthError)(`CSRF token fetch attempt ${attempt} failed`, {
                error: error.message,
                attempt,
                retries
            });
            if (attempt === retries) {
                console.error('All CSRF token fetch attempts failed');
                return null;
            }
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
    }
    return null;
};
exports.fetchCsrfToken = fetchCsrfToken;
// Initialize CSRF token on app startup
const initializeCsrfToken = async () => {
    try {
        await (0, exports.fetchCsrfToken)();
    }
    catch (error) {
        console.error('Failed to initialize CSRF token:', error);
        (0, error_logger_1.logAuthError)('Failed to initialize CSRF token', { error: error.message });
    }
};
exports.initializeCsrfToken = initializeCsrfToken;
// Get current base URL
const getCurrentBaseUrl = () => BASE_URL;
exports.getCurrentBaseUrl = getCurrentBaseUrl;
// Export the configured axios instance
exports.default = plainAxios;
