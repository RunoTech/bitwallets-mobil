import Linking from 'expo-linking';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { useAuth } from '../context/auth';

export default function LandingScreen() {
    const theme = useTheme();
    return (
        <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.containerTop, styles.container]}>
                <Image source={require('../../assets/images/landinglogo.png')}></Image>
                <Text style={[styles.text, {color: theme.colors.onPrimary}]}>Send and receive crypto instantly and securely</Text>
            </View>
            <View style={[styles.containerBottom, styles.container]}>
                <Link href={'/register'} asChild>
                    <Button style={styles.button} mode={'contained'}>Create Account & Wallets</Button>
                </Link>
                <Link href={'/import'} asChild>
                    <Button style={styles.button} mode={'contained'}>Import Existing Wallet</Button>
                </Link>
                <Text style={styles.footerText}>
                    By continuing, you agree to our&nbsp;
                    <Text style={{color: theme.colors.primary}} onPress={async () => await Linking.canOpenURL('https://reactnative.dev/docs/view') ? Linking.openURL('https://reactnative.dev/docs/view') : ''}>Terms of Service</Text>
                    &nbsp;and&nbsp;
                    <Text style={{color: theme.colors.primary}} onPress={async () => await Linking.canOpenURL('http://runo.com/tos') ? Linking.openURL('http://runo.com/tos') : ''}>Privacy Policy</Text>.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: 120
    },
    containerTop: {
    },
    containerBottom: {
    },
    text: {
        textAlign: 'center',
        fontWeight: 500,
        fontSize: 18,
        maxWidth: 250
    },
    button: {
        marginBottom: 18
    },
    footerText: {
        fontSize: 11
    }
});