"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MnemonicService = void 0;
const axios_1 = require("../lib/axios");
const deviceid_1 = require("../lib/deviceid");
const axios_2 = require("../lib/axios");
// Helper to wrap POST/PUT/DELETE with CSRF token and retry logic
async function withCsrfRetry(requestFn) {
    let csrfToken = await (0, axios_2.fetchCsrfToken)();
    if (!csrfToken)
        throw new Error('Failed to fetch CSRF token');
    let attempt = 0;
    while (attempt < 2) {
        try {
            return await requestFn(csrfToken);
        }
        catch (error) {
            if ((error.response?.status === 403 || error.response?.status === 419) && attempt === 0) {
                csrfToken = await (0, axios_2.fetchCsrfToken)();
                attempt++;
                continue;
            }
            throw error;
        }
    }
}
exports.MnemonicService = {
    // Generate a new mnemonic
    generateMnemonic: async () => {
        try {
            const deviceId = await (0, deviceid_1.getOrCreateDeviceId)();
            return await withCsrfRetry(async (csrfToken) => {
                const response = await axios_1.default.post('/mnemonic/generate', { deviceid: deviceId }, {
                    headers: { 'X-CSRF-Token': csrfToken },
                    withCredentials: true
                });
                return response.data;
            });
        }
        catch (error) {
            console.error('Error generating mnemonic:', error);
            return {
                success: false,
                error: error.response?.data?.error || error.message || 'Failed to generate mnemonic'
            };
        }
    },
    // Generate quiz for mnemonic verification
    generateQuiz: async (mnemonic) => {
        try {
            return await withCsrfRetry(async (csrfToken) => {
                const response = await axios_1.default.post('/mnemonic/quiz', { mnemonic }, {
                    headers: { 'X-CSRF-Token': csrfToken },
                    withCredentials: true
                });
                return response.data;
            });
        }
        catch (error) {
            console.error('Error generating quiz:', error);
            return {
                success: false,
                error: error.response?.data?.error || error.message || 'Failed to generate quiz'
            };
        }
    },
    // Verify mnemonic quiz answers
    verifyMnemonic: async (mnemonic, selectedWords, selectedIndices) => {
        try {
            return await withCsrfRetry(async (csrfToken) => {
                const response = await axios_1.default.post('/mnemonic/verify', {
                    mnemonic,
                    selectedWords,
                    selectedIndices
                }, {
                    headers: { 'X-CSRF-Token': csrfToken },
                    withCredentials: true
                });
                return response.data;
            });
        }
        catch (error) {
            console.error('Error verifying mnemonic:', error);
            return {
                success: false,
                error: error.response?.data?.error || error.message || 'Failed to verify mnemonic'
            };
        }
    }
};
