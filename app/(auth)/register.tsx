import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { useAuth } from '../context/auth';
import { getOrCreateDeviceId } from '../lib/deviceid';
import { useRouter } from 'expo-router';

interface IFormInput {
    password: string;
    confirmPassword: string;
}

export default function RegisterScreen() {
    const theme = useTheme();
    const [backendErrors, setBackendErrors] = useState<string[]>([]);
    const [isRegistering, setIsRegistering] = useState(false);

    const { register } = useAuth();
    const router = useRouter();

    const { control, handleSubmit, formState: { errors }, watch } = useForm<IFormInput>({
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    const onRegisterSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
            setBackendErrors([]);
            setIsRegistering(true);
            if (!data.password || data.password.length < 6) {
                setBackendErrors(['Password must be at least 6 characters']);
                return;
            }
            if (data.password !== data.confirmPassword) {
                setBackendErrors(['Passwords do not match']);
                return;
            }
            
            // Use the proper registration flow that handles user registration and wallet creation
            const deviceId = await getOrCreateDeviceId();
            const result = await register(deviceId, data.password, data.confirmPassword);
            
            if (result && result.success) {
                // Directly redirect to mnemonic generation
                router.push('/(auth)/mnemonic-generation' as any);
            } else {
                setBackendErrors(['Registration failed']);
            }
            
        } catch (e: any) {
            if (Array.isArray(e)) {
                setBackendErrors(e);
            } else {
                setBackendErrors([e.message || 'Registration failed']);
            }
        } finally {
            setIsRegistering(false);
        }
    };

    const password = watch('password');

    return (
        <View style={[styles.screen, { backgroundColor: theme.colors.background }]}> 
            <View style={styles.header}>
                <Text style={styles.title}>Create Wallet</Text>
                <Text style={styles.subtitle}>Set up your secure wallet</Text>
            </View>

            <View style={styles.form}>
                <Controller
                    control={control}
                    name="password"
                    rules={{
                        required: 'Password is required',
                        minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters'
                        }
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            label="Password"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            secureTextEntry
                            mode="outlined"
                            style={styles.input}
                            error={!!errors.password}
                        />
                    )}
                />
                {errors.password && (
                    <Text style={styles.errorText}>{errors.password.message}</Text>
                )}

                <Controller
                    control={control}
                    name="confirmPassword"
                    rules={{
                        required: 'Please confirm your password',
                        validate: (value) => value === password || 'Passwords do not match'
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            label="Confirm Password"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            secureTextEntry
                            mode="outlined"
                            style={styles.input}
                            error={!!errors.confirmPassword}
                        />
                    )}
                />
                {errors.confirmPassword && (
                    <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
                )}

                {backendErrors.length > 0 && (
                    <View style={styles.errorContainer}>
                        {backendErrors.map((error, index) => (
                            <Text key={index} style={styles.errorText}>{error}</Text>
                        ))}
                    </View>
                )}

                <Button
                    mode="contained"
                    onPress={handleSubmit(onRegisterSubmit)}
                    style={styles.button}
                    loading={isRegistering}
                    disabled={isRegistering}
                >
                    {isRegistering ? 'Creating Wallet...' : 'Create Wallet'}
                </Button>

                <View style={styles.linkContainer}>
                    <Text style={styles.linkText}>Already have a wallet? </Text>
                    <Link href="/(auth)/login" asChild>
                        <TouchableOpacity>
                            <Text style={[styles.linkText, { color: theme.colors.primary }]}>Sign In</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    form: {
        flex: 1,
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 24,
        marginBottom: 16,
        paddingVertical: 8,
    },
    linkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    linkText: {
        fontSize: 16,
    },
    errorText: {
        color: '#d32f2f',
        fontSize: 12,
        marginBottom: 8,
    },
    errorContainer: {
        marginBottom: 16,
    },
});