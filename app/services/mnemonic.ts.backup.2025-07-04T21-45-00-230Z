import axiosInstance from '../lib/axios';
import { getOrCreateDeviceId } from '../lib/deviceid';
import { fetchCsrfToken } from '../lib/axios';

export interface MnemonicData {
  mnemonic: string;
  mnemonicHash: string;
  wordCount: number;
  deviceid: string;
}

export interface QuizData {
  quizIndices: number[];
  totalWords: number;
}

export interface VerificationData {
  verified: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Helper to wrap POST/PUT/DELETE with CSRF token and retry logic
async function withCsrfRetry(requestFn: (csrfToken: string) => Promise<any>) {
  let csrfToken = await fetchCsrfToken();
  if (!csrfToken) throw new Error('Failed to fetch CSRF token');
  let attempt = 0;
  while (attempt < 2) {
    try {
      return await requestFn(csrfToken);
    } catch (error: any) {
      if ((error.response?.status === 403 || error.response?.status === 419) && attempt === 0) {
        csrfToken = await fetchCsrfToken();
        attempt++;
        continue;
      }
      throw error;
    }
  }
}

export const MnemonicService = {
  // Generate a new mnemonic
  generateMnemonic: async (): Promise<ApiResponse<MnemonicData>> => {
    try {
      const deviceId = await getOrCreateDeviceId();
      return await withCsrfRetry(async (csrfToken) => {
        const response = await axiosInstance.post('/mnemonic/generate', { deviceid: deviceId }, {
          headers: { 'X-CSRF-Token': csrfToken },
          withCredentials: true
        });
        return response.data;
      });
    } catch (error: any) {
      console.error('Error generating mnemonic:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to generate mnemonic'
      };
    }
  },

  // Generate quiz for mnemonic verification
  generateQuiz: async (mnemonic: string): Promise<ApiResponse<QuizData>> => {
    try {
      return await withCsrfRetry(async (csrfToken) => {
        const response = await axiosInstance.post('/mnemonic/quiz', { mnemonic }, {
          headers: { 'X-CSRF-Token': csrfToken },
          withCredentials: true
        });
        return response.data;
      });
    } catch (error: any) {
      console.error('Error generating quiz:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to generate quiz'
      };
    }
  },

  // Verify mnemonic quiz answers
  verifyMnemonic: async (
    mnemonic: string, 
    selectedWords: string[], 
    selectedIndices: number[]
  ): Promise<ApiResponse<VerificationData>> => {
    try {
      return await withCsrfRetry(async (csrfToken) => {
        const response = await axiosInstance.post('/mnemonic/verify', {
          mnemonic,
          selectedWords,
          selectedIndices
        }, {
          headers: { 'X-CSRF-Token': csrfToken },
          withCredentials: true
        });
        return response.data;
      });
    } catch (error: any) {
      console.error('Error verifying mnemonic:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to verify mnemonic'
      };
    }
  }
}; 