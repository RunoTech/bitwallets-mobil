import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from './auth';
import { Wallet, Transaction, TransactionStats } from '../types/wallet';
import { WalletService } from '../services/wallet';
import { getOrCreateDeviceId } from '../lib/deviceid';
import { ethers } from 'ethers';

type WalletContextType = {
    wallets: Wallet[];
    isLoading: boolean;
    createWallet: (blockchain: string) => Promise<Wallet>;
    getWallets: () => Promise<void>;
    selectedWallet: Wallet | null;
    setSelectedWallet: (wallet: Wallet | null) => void;
    getWalletTransactions: (address: string) => Promise<Transaction[]>;
    getTransactionStats: () => Promise<TransactionStats | null>;
    importWalletByMnemonic: (blockchain: string, mnemonic: string) => Promise<Wallet>;
    importWalletByPrivateKey: (blockchain: string, privateKey: string) => Promise<Wallet>;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

function WalletProvider({ children }: { children: React.ReactNode }) {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
    const { deviceId, isAuthenticated } = useAuth();

    const getWallets = useCallback(async () => {
        if (!isAuthenticated) {
            console.log('User not authenticated, skipping wallet fetch');
            setWallets([]);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const response = await WalletService.getWallets();
            if (response.success && response.data) {
                const walletsWithBalances = response.data as Wallet[];
                // For each wallet, fetch the live balance and update it
                const walletsToFetch: Wallet[] = walletsWithBalances.filter(wallet => wallet.network !== 'SOL');
                await Promise.all(walletsToFetch.map(async (wallet: Wallet, idx: number) => {
                    try {
                        const balanceResp = await WalletService.getWalletBalance(String(wallet.wallet), String(wallet.network));
                        if (
                            balanceResp.success &&
                            balanceResp.data &&
                            typeof balanceResp.data.balance === 'object' &&
                            balanceResp.data.balance !== null
                        ) {
                            const realBalance = parseFloat(String(balanceResp.data.balance.balance));
                            const extraBalance = parseFloat(String(balanceResp.data.balance.extra_balance));
                            wallet.balance = realBalance + extraBalance;
                            wallet.extra_balance = extraBalance;
                        } else if (
                            balanceResp.success &&
                            balanceResp.data &&
                            typeof balanceResp.data.balance !== 'undefined'
                        ) {
                            wallet.balance = parseFloat(String(balanceResp.data.balance));
                        }
                    } catch (e) {
                        // Ignore balance fetch errors, keep DB value
                    }
                }));
                setWallets(walletsWithBalances);
            } else {
                console.error('Failed to fetch wallets:', response.error);
                setWallets([]);
            }
        } catch (error: any) {
            console.error('Error fetching wallets:', error);
            setWallets([]);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (deviceId && isAuthenticated) {
            console.log('User authenticated, fetching wallets...');
            getWallets();
        } else {
            console.log('User not authenticated or no deviceId, clearing wallets');
            setWallets([]);
            setIsLoading(false);
        }
    }, [deviceId, isAuthenticated, getWallets]);

    const createWallet = useCallback(async (blockchain: string): Promise<Wallet> => {
        try {
            const response = await WalletService.createWallet(blockchain);
            if (response.success && response.data) {
                const newWallet = response.data as Wallet;
                setWallets(prev => [...prev, newWallet]);
                return newWallet;
            } else {
                throw new Error(response.error || 'Failed to create wallet');
            }
        } catch (error) {
            console.error('Error creating wallet:', error);
            throw error;
        }
    }, []);

    const getWalletTransactions = useCallback(async (address: string): Promise<Transaction[]> => {
        try {
            const response = await WalletService.getWalletTransactions(address);
            if (response.success && response.data) {
                return response.data;
            }
            return [];
        } catch (error) {
            console.error('Error fetching wallet transactions:', error);
            return [];
        }
    }, []);

    const getTransactionStats = useCallback(async (): Promise<TransactionStats | null> => {
        try {
            const response = await WalletService.getTransactionStats();
            if (response.success && response.data) {
                return response.data;
            }
            return null;
        } catch (error) {
            console.error('Error fetching transaction stats:', error);
            return null;
        }
    }, []);

    const importWalletByMnemonic = useCallback(async (blockchain: string, mnemonic: string): Promise<Wallet> => {
        const response = await WalletService.importWalletByMnemonic(blockchain, mnemonic);
        if (response.success && response.data) {
            setWallets(prev => response.data ? [...prev, response.data] : prev);
            return response.data;
        } else {
            throw new Error(response.error || 'Failed to import wallet');
        }
    }, []);

    const importWalletByPrivateKey = useCallback(async (blockchain: string, privateKey: string): Promise<Wallet> => {
        const response = await WalletService.importWalletByPrivateKey(blockchain, privateKey);
        if (response.success && response.data) {
            setWallets(prev => response.data ? [...prev, response.data] : prev);
            return response.data;
        } else {
            throw new Error(response.error || 'Failed to import wallet');
        }
    }, []);

    return (
        <WalletContext.Provider
            value={{
                wallets,
                isLoading,
                createWallet,
                getWallets,
                selectedWallet,
                setSelectedWallet,
                getWalletTransactions,
                getTransactionStats,
                importWalletByMnemonic,
                importWalletByPrivateKey,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
}

function useWallet() {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
}

export { useWallet, WalletProvider };
export default WalletProvider;