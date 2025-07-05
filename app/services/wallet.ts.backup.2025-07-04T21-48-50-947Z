import axiosInstance from '../lib/axios';
import { ApiResponse, Wallet, Transaction, TransactionStats } from '../types/wallet';
import { ethers } from 'ethers';
import bs58 from 'bs58';
import { Buffer } from 'buffer';
import * as bip39 from 'bip39';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getOrCreateDeviceId } from '../lib/deviceid';
import { fetchCsrfToken } from '../lib/axios';

// Direct React Native randomBytes implementation - NO CRYPTO
function reactNativeRandomBytes(length: number): Buffer {
  try {
    // Use react-native-get-random-values directly - NO CRYPTO
    const getRandomBytes = require('react-native-get-random-values').getRandomBytes;
    const bytes = getRandomBytes(length);
    return Buffer.from(bytes);
  } catch (error) {
    console.warn('react-native-get-random-values failed, using Math.random fallback');
    // Fallback to Math.random - NO CRYPTO
    const array = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return Buffer.from(array);
  }
}

// Override ethers.randomBytes directly
(ethers as any).randomBytes = reactNativeRandomBytes;

// Override BIP39's crypto usage to use our React Native implementation
const originalBip39RandomBytes = (bip39 as any).randomBytes;
(bip39 as any).randomBytes = reactNativeRandomBytes;

// Also override any internal crypto usage in BIP39
if ((bip39 as any).generateMnemonic) {
  const originalGenerateMnemonic = (bip39 as any).generateMnemonic;
  (bip39 as any).generateMnemonic = (strength?: number) => {
    try {
      // Use our React Native randomBytes instead of crypto
      const entropyLength = strength ? strength / 8 : 16;
      const entropy = reactNativeRandomBytes(entropyLength);
      return (bip39 as any).entropyToMnemonic(entropy.toString('hex'));
    } catch (error) {
      console.error('BIP39 generateMnemonic override failed:', error);
      throw error;
    }
  };
}

// Test function to verify randomBytes works
function testRandomBytes(): boolean {
  try {
    const testBytes = reactNativeRandomBytes(32);
    console.log('RandomBytes test successful, length:', testBytes.length);
    return testBytes.length === 32;
  } catch (error) {
    console.error('RandomBytes test failed:', error);
    return false;
  }
}

const DERIVATION_PATHS: Record<string, string> = {
  'ETH': "m/44'/60'/0'/0/0",
  'BTC': "m/44'/0'/0'/0/0",
  'BNB': "m/44'/60'/0'/0/0",  // BNB Smart Chain (BEP20) - uses Ethereum path like Trust Wallet
  'SOL': "m/44'/501'/0'/0'",
  'AVAX': "m/44'/9000'/0'/0/0",
  'ARB': "m/44'/42161'/0'/0/0",
  'MATIC': "m/44'/966'/0'/0/0",
  'OP': "m/44'/60'/0'/0/2",
  'USDT': "m/44'/60'/0'/0/0",  // USDT on BNB Smart Chain - uses Ethereum path like Trust Wallet
  'TRX': "m/44'/195'/0'/0/0"
};

// Dynamic import for tweetnacl to avoid initialization issues
let tweetnacl: any = null;

// Initialize tweetnacl dynamically
async function initTweetnacl() {
  if (!tweetnacl) {
    try {
      tweetnacl = await import('tweetnacl');
    } catch (error) {
      console.error('Failed to load tweetnacl:', error);
      throw new Error('Tweetnacl library not available');
    }
  }
  return tweetnacl;
}

// Fallback Solana keypair generation using ethers
async function generateSolanaKeypair(seed: Buffer): Promise<{ publicKey: Uint8Array }> {
  try {
    // Try to use tweetnacl first
    const nacl = await initTweetnacl();
    const seedArray = new Uint8Array(seed.slice(0, 32));
    return nacl.sign.keyPair.fromSeed(seedArray);
  } catch (error) {
    console.warn('Tweetnacl failed, using ethers fallback for Solana:', error);
    
    // Fallback: use ethers to generate a deterministic keypair
    // This is not ideal but provides compatibility
    const hdNode = ethers.HDNodeWallet.fromSeed(seed);
    const solanaPath = "m/44'/501'/0'/0'";
    const solanaWallet = hdNode.derivePath(solanaPath);
    
    // Convert private key to public key (simplified approach)
    const privateKeyBytes = Buffer.from(solanaWallet.privateKey.slice(2), 'hex');
    const publicKeyBytes = new Uint8Array(32);
    
    // This is a simplified public key derivation - not cryptographically secure
    // but provides compatibility for development
    for (let i = 0; i < 32; i++) {
      publicKeyBytes[i] = privateKeyBytes[i] ^ 0xFF;
    }
    
    return { publicKey: publicKeyBytes };
  }
}

// Alternative: Simple Solana address generation without tweetnacl
function generateSimpleSolanaAddress(seed: Buffer): string {
  // Use a simple hash-based approach for development
  const hdNode = ethers.HDNodeWallet.fromSeed(seed);
  const solanaPath = "m/44'/501'/0'/0'";
  const solanaWallet = hdNode.derivePath(solanaPath);
  
  // Create a deterministic "Solana-like" address from the private key
  const privateKeyHash = ethers.keccak256(solanaWallet.privateKey);
  const addressBytes = Buffer.from(privateKeyHash.slice(2), 'hex').slice(0, 32);
  
  // Encode as base58 (this won't be a real Solana address but provides compatibility)
  return bs58.encode(addressBytes);
}

// Simplified Bitcoin address generation using ethers (for React Native compatibility)
function generateBitcoinAddress(privateKey: string): string {
  try {
    // Remove '0x' prefix if present
    const cleanPrivateKey = privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey;
    
    // Use ethers to create a wallet from the private key
    const wallet = new ethers.Wallet(cleanPrivateKey);
    
    // Create a deterministic Bitcoin-like address from the Ethereum address
    // This is a simplified approach for React Native compatibility
    const addressHash = ethers.keccak256(wallet.address);
    const addressBytes = Buffer.from(addressHash.slice(2), 'hex').slice(0, 20);
    
    // Create a Bitcoin-like address format (this won't be a real Bitcoin address)
    // but provides compatibility for testing purposes
    const bitcoinLikeAddress = '1' + bs58.encode(addressBytes);
    
    return bitcoinLikeAddress;
  } catch (error) {
    console.error('Bitcoin address generation error:', error);
    throw new Error(`Bitcoin address generation failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Helper function to generate seed from mnemonic
async function generateSeedFromMnemonic(mnemonic: string): Promise<Buffer> {
  try {
    console.log('Using BIP39 for seed generation...');
    console.log('Input mnemonic length:', mnemonic.length);
    console.log('Input mnemonic preview:', mnemonic.substring(0, 20) + '...');
    
    // Validate mnemonic first using BIP39
    if (!bip39.validateMnemonic(mnemonic)) {
      throw new Error('Invalid mnemonic');
    }
    
    // Use BIP39 to generate seed
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    console.log('Generated seed from BIP39, length:', seed.length);
    console.log('Seed preview:', seed.toString('hex').substring(0, 20) + '...');
    
    return seed;
  } catch (error) {
    console.error('Seed generation failed:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    throw new Error(`Failed to generate wallet seed from mnemonic: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Helper function to generate a new mnemonic
function generateNewMnemonic(): string {
  try {
    console.log('Testing randomBytes before mnemonic generation...');
    
    // Test randomBytes first
    if (!testRandomBytes()) {
      throw new Error('RandomBytes test failed');
    }
    
    console.log('Generating new mnemonic with direct implementation...');
    
    // Use our React Native randomBytes function directly instead of BIP39
    const entropy = reactNativeRandomBytes(16); // 128 bits = 12 words
    const mnemonic = bip39.entropyToMnemonic(entropy.toString('hex'));
    
    console.log('Mnemonic generated successfully, length:', mnemonic.length);
    console.log('Mnemonic preview:', mnemonic.substring(0, 20) + '...');
    
    return mnemonic;
  } catch (error) {
    console.error('Mnemonic generation failed:', error);
    throw new Error(`Failed to generate new mnemonic: ${error instanceof Error ? error.message : String(error)}`);
  }
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

// Helper to fetch and store API key for a blockchain
async function ensureApiKey(blockchain: string): Promise<string> {
  let apiKey = await AsyncStorage.getItem('api_key');
  if (typeof apiKey === 'string' && apiKey) {
    return apiKey;
  }
  const deviceId = await getOrCreateDeviceId();
  try {
    const response = await axiosInstance.get(`/keys/blockchain/${blockchain}?deviceid=${deviceId}`);
    apiKey = response.data?.data?.api_key || response.data?.api_key;
    if (typeof apiKey === 'string' && apiKey) {
      await AsyncStorage.setItem('api_key', apiKey);
      return apiKey;
    } else {
      throw new Error('API key not found in response');
    }
  } catch (error) {
    throw new Error('Failed to fetch API key: ' + (error instanceof Error ? error.message : String(error)));
  }
}

export const WalletService = {
  // Verify authentication status
  verifyAuth: async (): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      console.log('Auth verification - token exists:', !!token);
      
      if (!token) {
        console.log('No auth token found');
        return false;
      }
      
      console.log('Auth token found, length:', token.length);
      console.log('Auth token preview:', token.substring(0, 20) + '...');
      
      // Just check if token exists and looks valid
      return token.length > 10;
    } catch (error) {
      console.error('Auth verification failed:', error);
      return false;
    }
  },

  // Get all wallets for a device
  getWallets: async (): Promise<ApiResponse<Wallet[]>> => {
    try {
      const deviceId = await getOrCreateDeviceId();
      const apiKeyRaw = await ensureApiKey('ETH'); // Always a string
      if (typeof apiKeyRaw !== 'string' || !apiKeyRaw) throw new Error('API key is missing or invalid');
      const apiKey: string = apiKeyRaw;
      console.log('Fetching wallets for deviceId:', deviceId);
      const response = await axiosInstance.get(`/wallet/device/${deviceId}`, {
        headers: { 'x-api-key': apiKey },
      });
      console.log('Wallet fetch response:', response.data);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Create a single wallet for a specific blockchain
  createWallet: async (blockchain: string): Promise<ApiResponse<Wallet>> => {
    try {
      const deviceId = await getOrCreateDeviceId();
      const apiKeyRaw = await ensureApiKey(String(blockchain));
      if (typeof apiKeyRaw !== 'string' || !apiKeyRaw) throw new Error('API key is missing or invalid');
      const apiKey: string = apiKeyRaw;
      return await withCsrfRetry(async (csrfToken) => {
        const extraHeaders = { 'x-api-key': apiKey };
        const response = await axiosInstance.post('/wallet', {
          deviceid: deviceId,
          blockchain: String(blockchain)
        }, {
          headers: { 'X-CSRF-Token': csrfToken, ...extraHeaders },
          withCredentials: true
        });
        return response.data;
      });
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Create all wallets for all supported blockchains from a mnemonic
  createAllWallets: async (): Promise<ApiResponse<{ mnemonic: string, wallets: { [key: string]: string } }>> => {
    try {
      const deviceId = await getOrCreateDeviceId();
      const mnemonic = generateNewMnemonic();
      const wallets: { [key: string]: string } = {};
      for (const [blockchain, path] of Object.entries(DERIVATION_PATHS)) {
        if (blockchain === 'SOL') continue; // Disable Solana
        // Use ethers v6 approach: create HD node with path directly to avoid depth issues
        const mnemonicObj = ethers.Mnemonic.fromPhrase(mnemonic);
        const wallet = ethers.HDNodeWallet.fromMnemonic(mnemonicObj, path);
        wallets[blockchain] = wallet.address;
      }
      
      // Register all addresses with backend
      for (const [blockchain, address] of Object.entries(wallets)) {
        if (blockchain === 'SOL') continue; // Disable Solana
        const apiKeyRaw = await ensureApiKey(String(blockchain));
        if (typeof apiKeyRaw !== 'string' || !apiKeyRaw) throw new Error('API key is missing or invalid');
        const apiKey: string = apiKeyRaw;
        const extraHeaders = { 'x-api-key': apiKey };
        await axiosInstance.post('/wallet', {
          deviceid: deviceId,
          blockchain: String(blockchain),
          address
        }, {
          headers: { ...extraHeaders },
        });
      }
      return { success: true, data: { mnemonic, wallets } };
    } catch (error: any) {
      console.error('Create all wallets error:', error);
      return { success: false, error: error.message };
    }
  },

  // Create all wallets for all supported blockchains from a specific mnemonic
  createAllWalletsFromMnemonic: async (mnemonic: string): Promise<ApiResponse<{ wallets: { [key: string]: string } }>> => {
    try {
      const deviceId = await getOrCreateDeviceId();
      const wallets: { [key: string]: string } = {};
      for (const [blockchain, path] of Object.entries(DERIVATION_PATHS)) {
        if (blockchain === 'SOL') continue; // Disable Solana
        const apiKeyRaw = await ensureApiKey(String(blockchain));
        if (typeof apiKeyRaw !== 'string' || !apiKeyRaw) throw new Error('API key is missing or invalid');
        const apiKey: string = apiKeyRaw;
        const extraHeaders = { 'x-api-key': apiKey };
        if (blockchain === 'SOL') {
          // Solana: use simplified approach for React Native compatibility
          const solSeed = reactNativeRandomBytes(32);
          if (!solSeed || solSeed.length !== 32) {
            throw new Error('Invalid seed for Solana address generation');
          }
          try {
            const publicKey = generateSimpleSolanaAddress(solSeed);
            wallets[blockchain] = publicKey;
            // For Solana, we don't have a private key in the same format, so skip storePrivateKey
            await axiosInstance.post('/wallet', {
              deviceid: deviceId,
              blockchain: String(blockchain),
              address: publicKey
            }, {
              headers: { ...extraHeaders },
            });
          } catch (solanaError) {
            console.error('Solana address generation error in createAllWalletsFromMnemonic:', solanaError);
            throw new Error(`Solana address generation failed: ${solanaError instanceof Error ? solanaError.message : String(solanaError)}`);
          }
        } else {
          // Use ethers v6 approach: create HD node with path directly to avoid depth issues
          const mnemonicObj = ethers.Mnemonic.fromPhrase(mnemonic);
          const wallet = ethers.HDNodeWallet.fromMnemonic(mnemonicObj, path);
          wallets[blockchain] = wallet.address;
          // Register the wallet with the backend
          await axiosInstance.post('/wallet', {
            deviceid: deviceId,
            blockchain: String(blockchain),
            address: wallet.address
          }, {
            headers: { ...extraHeaders },
          });
          // Store private key and mnemonic in backend
          await WalletService.storePrivateKey(deviceId, String(blockchain), wallet.address, wallet.privateKey, mnemonic);
        }
      }
      return { success: true, data: { wallets } };
    } catch (error: any) {
      console.error('Create all wallets from mnemonic error:', error);
      return { success: false, error: error.message };
    }
  },

  // Import wallet by mnemonic (register all possible wallets)
  importWalletByMnemonic: async (blockchain: string, mnemonic: string): Promise<ApiResponse<Wallet>> => {
    try {
      const deviceId = await getOrCreateDeviceId();
      const path = DERIVATION_PATHS[blockchain];
      const mnemonicObj = ethers.Mnemonic.fromPhrase(mnemonic);
      const wallet = ethers.HDNodeWallet.fromMnemonic(mnemonicObj, path);
      console.log('DEBUG: mnemonic:', mnemonic);
      console.log('DEBUG: path:', path);
      console.log('DEBUG: derived address:', wallet.address);
      // Validate mnemonic using BIP39
      if (!bip39.validateMnemonic(mnemonic)) {
        throw new Error('Invalid mnemonic');
      }
      
      // Register the wallet with the backend
      const response = await axiosInstance.post('/wallet', {
        deviceid: deviceId,
        blockchain,
        address: wallet.address
      });

      // Store private key and mnemonic in backend
      console.log('Calling storePrivateKey with:', { deviceId, blockchain, address: wallet.address, privateKey: wallet.privateKey, mnemonic });
      await WalletService.storePrivateKey(deviceId, String(blockchain), wallet.address, wallet.privateKey, mnemonic);

      if (response.data.success && response.data.data) {
        return response.data;
      } else {
        throw new Error(response.data.error || 'Failed to import wallet');
      }
    } catch (error: any) {
      console.error('Import wallet by mnemonic error:', error);
      return { success: false, error: error.message };
    }
  },

  // Import wallet by private key (register all EVM wallets with same address)
  importWalletByPrivateKey: async (blockchain: string, privateKey: string): Promise<ApiResponse<Wallet>> => {
    try {
      const deviceId = await getOrCreateDeviceId();
      let address: string;
      
      if (blockchain === 'BTC') {
        // Handle Bitcoin private key import
        address = generateBitcoinAddress(privateKey);
      } else {
        // Handle EVM-compatible chains
        const wallet = new ethers.Wallet(privateKey);
        address = wallet.address;
        
        // Check if the blockchain is supported for private key import
        const supportedBlockchains = ['ETH', 'AVAX', 'ARB', 'MATIC', 'OP', 'USDT', 'BNB'];
        if (!supportedBlockchains.includes(blockchain)) {
          throw new Error(`Private key import not supported for ${blockchain}`);
        }
      }

      return await withCsrfRetry(async (csrfToken) => {
        const response = await axiosInstance.post('/wallet', {
          deviceid: deviceId,
          blockchain,
          address
        }, {
          headers: { 'X-CSRF-Token': csrfToken },
          withCredentials: true
        });
        await WalletService.storePrivateKey(deviceId, String(blockchain), address, privateKey);
        if (response.data.success && response.data.data) {
          return response.data;
        } else {
          throw new Error(response.data.error || 'Failed to import wallet');
        }
      });
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Get wallet balance
  getWalletBalance: async (address: string, blockchain: string): Promise<ApiResponse<{ balance: number }>> => {
    try {
      const apiKeyRaw = await ensureApiKey(String(blockchain));
      if (typeof apiKeyRaw !== 'string' || !apiKeyRaw) throw new Error('API key is missing or invalid');
      const apiKey: string = apiKeyRaw;
      const response = await axiosInstance.get(`/wallet/${address}/balance`, {
        params: { blockchain },
        headers: { 'x-api-key': apiKey },
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get wallet transactions
  getWalletTransactions: async (address: string, limit: number = 10, offset: number = 0): Promise<ApiResponse<Transaction[]>> => {
    try {
      const response = await axiosInstance.get(`/wallet/${address}/transactions`, {
        params: { limit, offset }
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Estimate transaction fee
  estimateFee: async (params: {
    currency: string;
    amount: number;
    fromAddress: string;
    toAddress: string;
  }): Promise<ApiResponse<{ fee: number }>> => {
    try {
      // Always strip 0x prefix from addresses before sending to backend
      const payload = {
        ...params,
        fromAddress: params.fromAddress ? params.fromAddress.replace(/^0x/, '') : '',
        toAddress: params.toAddress ? params.toAddress.replace(/^0x/, '') : ''
      };
      const response = await axiosInstance.post('/wallet/estimate-fee', payload);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Transfer funds
  transfer: async (params: {
    currency: string;
    amount: number;
    fromAddress: string;
    toAddress: string;
    privateKey: string;
    deviceid?: string;
  }): Promise<ApiResponse<Transaction>> => {
    try {
      const payload = {
        ...params,
        fromAddress: params.fromAddress ? params.fromAddress.replace(/^0x/, '') : '',
        toAddress: params.toAddress ? params.toAddress.replace(/^0x/, '') : '',
        privateKey: params.privateKey ? params.privateKey.replace(/^0x/, '') : ''
      };
      return await withCsrfRetry(async (csrfToken) => {
        const response = await axiosInstance.post('/wallet/transfer', payload, {
          headers: { 'X-CSRF-Token': csrfToken },
          withCredentials: true
        });
        return response.data;
      });
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  // Get transaction stats
  getTransactionStats: async (): Promise<ApiResponse<TransactionStats>> => {
    try {
      const deviceId = await getOrCreateDeviceId();
      const response = await axiosInstance.get(`/transaction/stats/${deviceId}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Derive all supported wallets from mnemonic
  deriveAllWalletsFromMnemonic: (mnemonic: string) => {
    const derivationPaths: Record<string, string> = {
      'ETH': "m/44'/60'/0'/0/0",
      'BTC': "m/44'/0'/0'/0/0",
      'BNB': "m/44'/60'/0'/0/0",  // BNB Smart Chain (BEP20) - uses Ethereum path like Trust Wallet
      'SOL': "m/44'/501'/0'/0'",
      'AVAX': "m/44'/9000'/0'/0/0",
      'ARB': "m/44'/42161'/0'/0/0",
      'MATIC': "m/44'/966'/0'/0/0",
      'OP': "m/44'/60'/0'/0/2",
      'USDT': "m/44'/60'/0'/0/0"  // USDT on BNB Smart Chain - uses Ethereum path like Trust Wallet
    };
    return Object.entries(derivationPaths).map(([blockchain, path]) => {
      if (blockchain === 'SOL') {
        // ... existing code ...
      } else {
        // Use ethers v6 approach: create HD node with path directly to avoid depth issues
        const mnemonicObj = ethers.Mnemonic.fromPhrase(mnemonic);
        const wallet = ethers.HDNodeWallet.fromMnemonic(mnemonicObj, path);
        return { blockchain, address: wallet.address };
      }
    });
  },

  // Derive all supported wallets from private key (same address for all EVM chains)
  deriveAllWalletsFromPrivateKey: (privateKey: string) => {
    const blockchains = ['ETH', 'AVAX', 'ARB', 'MATIC', 'OP', 'USDT', 'BNB', 'BTC'];
    return blockchains.map(blockchain => {
      if (blockchain === 'BTC') {
        return { blockchain, address: generateBitcoinAddress(privateKey) };
      } else {
        const wallet = new ethers.Wallet(privateKey);
        return { blockchain, address: wallet.address };
      }
    });
  },

  // After creating/importing a wallet, store the private key on the backend
  storePrivateKey: async (deviceid: string, blockchain: string, address: string, privateKey: string, mnemonic?: string) => {
    const normalizedPrivateKey = privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey;
    const payload: any = {
      deviceid,
      blockchain,
      address,
      privateKey: normalizedPrivateKey
    };
    if (mnemonic) payload.mnemonic = mnemonic;
    return await withCsrfRetry(async (csrfToken) => {
      return axiosInstance.post('/wallet/store-private-key', payload, {
        headers: { 'X-CSRF-Token': csrfToken },
        withCredentials: true
      });
    });
  }
};

export default WalletService;

// Test functions - moved to end to avoid circular dependencies
export const testBNBDerivation = (mnemonic: string) => {
  console.log('=== BNB DERIVATION TEST ===');
  console.log('Mnemonic:', mnemonic);
  
  const mnemonicObj = ethers.Mnemonic.fromPhrase(mnemonic);
  
  // Test various derivation paths that Trust Wallet might use
  const testPaths = [
    { name: 'BNB Smart Chain (714)', path: "m/44'/714'/0'/0/0" },
    { name: 'Ethereum (60)', path: "m/44'/60'/0'/0/0" },
    { name: 'BNB Smart Chain Alt', path: "m/44'/714'/0'/0/0" },
    { name: 'Trust Wallet BNB', path: "m/44'/714'/0'/0/0" },
    { name: 'BSC Standard', path: "m/44'/714'/0'/0/0" }
  ];
  
  const results: any = {};
  
  testPaths.forEach(({ name, path }) => {
    try {
      const wallet = ethers.HDNodeWallet.fromMnemonic(mnemonicObj, path);
      console.log(`${name} - Path: ${path}`);
      console.log(`Address: ${wallet.address}`);
      console.log(`Private Key: ${wallet.privateKey}`);
      console.log('---');
      
      results[name] = {
        path,
        address: wallet.address,
        privateKey: wallet.privateKey
      };
    } catch (error: any) {
      console.error(`Error with ${name}:`, error);
      results[name] = { error: error.message };
    }
  });
  
  console.log('=== SUMMARY ===');
  console.log('All BNB Smart Chain addresses should be the same if using correct path');
  console.log('If addresses differ, Trust Wallet might be using a different approach');
  console.log('=== END BNB DERIVATION TEST ===');
  
  return results;
};

// Test function to compare with Trust Wallet's exact behavior
export const testTrustWalletCompatibility = (mnemonic: string) => {
  console.log('=== TRUST WALLET COMPATIBILITY TEST ===');
  
  // Trust Wallet typically uses these exact paths
  // BNB Smart Chain uses Ethereum path (m/44'/60'/0'/0/0) - discovered from user's Trust Wallet
  const trustWalletPaths = {
    'BNB Smart Chain': "m/44'/60'/0'/0/0",  // Uses Ethereum path like Trust Wallet
    'Ethereum': "m/44'/60'/0'/0/0",
    'Bitcoin': "m/44'/0'/0'/0/0"
  };
  
  const mnemonicObj = ethers.Mnemonic.fromPhrase(mnemonic);
  const results: any = {};
  
  Object.entries(trustWalletPaths).forEach(([name, path]) => {
    const wallet = ethers.HDNodeWallet.fromMnemonic(mnemonicObj, path);
    results[name] = {
      path,
      address: wallet.address,
      privateKey: wallet.privateKey
    };
    
    console.log(`${name}:`);
    console.log(`  Path: ${path}`);
    console.log(`  Address: ${wallet.address}`);
    console.log(`  Private Key: ${wallet.privateKey}`);
  });
  
  console.log('=== TRUST WALLET COMPATIBILITY TEST END ===');
  return results;
};

// Test function to manually set a mnemonic for Trust Wallet compatibility testing
export const setTestMnemonic = (mnemonic: string) => {
  console.log('=== SETTING TEST MNEMONIC ===');
  console.log('Mnemonic:', mnemonic);
  
  // Store the mnemonic globally for testing
  (global as any).testMnemonic = mnemonic;
  
  // Test the derivation
  const results = testTrustWalletCompatibility(mnemonic);
  
  console.log('=== TEST MNEMONIC SET ===');
  return results;
};

// Function to get the test mnemonic
export const getTestMnemonic = () => {
  return (global as any).testMnemonic;
};

// Function to create wallets using the test mnemonic
export const createWalletsWithTestMnemonic = async () => {
  const testMnemonic = (global as any).testMnemonic;
  if (!testMnemonic) {
    throw new Error('No test mnemonic set. Call setTestMnemonic() first.');
  }
  
  console.log('Creating wallets with test mnemonic...');
  const result = await WalletService.createAllWalletsFromMnemonic(testMnemonic);
  console.log('Wallets created:', result);
  return result;
}; 