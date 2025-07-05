import { Link } from 'expo-router';
import React from 'react';
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { useAuth } from '../context/auth';

interface IFormInput {
    email: string;
    password: string;
    confirmPassword: string;
}

export default function RegisterScreen() {
    const {
        registerCurrentStep,
        setRegisterCurrentStep,
        registerEmail,
        setRegisterEmail,
        registerPassword,
        setRegisterPassword,
        registerConfirmPassword,
        setRegisterConfirmPassword,
    } = useAuth();
    const theme = useTheme();
    
    const {
        control: emailControl,
        handleSubmit: handleEmailSubmit,
        formState: { errors: emailErrors },
    } = useForm<IFormInput>({
        defaultValues: {
            email: '',
        },
    });

    const {
        control: passwordControl,
        handleSubmit: handlePasswordSubmit,
        formState: { errors: passwordErrors },
    } = useForm<IFormInput>({
        defaultValues: {
            password: '',
        },
    });

    const {
        control: confirmPasswordControl,
        handleSubmit: handleConfirmPasswordSubmit,
        formState: { errors: confirmPasswordErrors },
    } = useForm<IFormInput>({
        defaultValues: {
            confirmPassword: '',
        },
    });

    const onRegisterSubmit: SubmitHandler<IFormInput> = (data) => {
        switch (registerCurrentStep) {
            case 1:
                if (!emailErrors.email) {
                    setRegisterEmail(data.email);
                    setRegisterCurrentStep(registerCurrentStep+1);
                }
                break;
            case 2:
                if (!passwordErrors.password) {
                    setRegisterPassword(data.password);
                    setRegisterCurrentStep(registerCurrentStep+1);
                }
                break;
            case 3:
                if (!confirmPasswordErrors.confirmPassword) {
                    setRegisterConfirmPassword(data.confirmPassword);
                    alert('Registration successful: ' + JSON.stringify(data));
                }
                break;
        }
        //register(data.email, data.password);
    };

    return (
        <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
            <Text variant="headlineMedium" style={styles.title}>
                Create Account
            </Text>
            {
                (() => {
                    switch (registerCurrentStep) {
                        case 1:
                            return (
                                <>
                                    <Controller
                                        control={emailControl}
                                        rules={{
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Invalid email address',
                                            },
                                        }}
                                        render={({ field: { onChange, value } }) => (
                                            <>
                                                <Text>{JSON.stringify(value)}</Text>
                                                <TextInput
                                                    label="Email"
                                                    value={value}
                                                    onChangeText={onChange}
                                                    autoCapitalize="none"
                                                    keyboardType="email-address"
                                                    style={styles.input}
                                                    error={!!emailErrors.email}
                                                />
                                            </>

                                        )}
                                        name="email"
                                    />
                                    {emailErrors.email && (
                                        <Text style={styles.errorText}>{emailErrors.email.message}email</Text>
                                    )}
                                    <Button
                                        mode="contained"
                                        onPress={handleEmailSubmit(onRegisterSubmit)}
                                        style={styles.button}
                                    >
                                        Next ({registerCurrentStep}/3)
                                    </Button>
                                </>
                            )
                        case 2:
                            return (
                                <>
                                    <Controller
                                        control={passwordControl}
                                        rules={{
                                            required: 'Password is required',
                                            minLength: {
                                                value: 6,
                                                message: 'Password must be at least 6 characters',
                                            },
                                        }}
                                        render={({ field: { onChange, value } }) => (
                                            <>
                                                <Text>{JSON.stringify(value)}</Text>
                                                <TextInput
                                                    label="Password"
                                                    value={value}
                                                    onChangeText={onChange}
                                                    secureTextEntry
                                                    style={styles.input}
                                                    error={!!passwordErrors.password}
                                                />
                                            </>

                                        )}
                                        name="password"
                                    />
                                    {passwordErrors.password && (
                                        <Text style={styles.errorText}>{passwordErrors.password.message}pw</Text>
                                    )}
                                </>
                            )
                        case 3:
                            return (
                                <>
                                    <Controller
                                        control={confirmPasswordControl}
                                        rules={{
                                            required: 'Please confirm your password',
                                            validate: value => value === registerPassword || 'Passwords do not match',
                                        }}
                                        render={({ field: { onChange, value } }) => (
                                            <TextInput
                                                label="Confirm Password"
                                                value={value}
                                                onChangeText={onChange}
                                                secureTextEntry
                                                style={styles.input}
                                                error={!!confirmPasswordErrors.confirmPassword}
                                            />
                                        )}
                                        name="confirmPassword"
                                    />
                                    {confirmPasswordErrors.confirmPassword && (
                                        <Text style={styles.errorText}>{confirmPasswordErrors.confirmPassword.message}cpw</Text>
                                    )}
                                </>
                            )
                    }
                })()
            }
            <Text>{JSON.stringify({registerEmail, registerPassword, registerConfirmPassword, registerCurrentStep})}</Text>


            {
                registerCurrentStep > 1 && (
                    <Button
                        mode="outlined"
                        onPress={() => setRegisterCurrentStep(registerCurrentStep - 1)}
                        style={styles.button}
                    >
                        Back
                    </Button>
                )
            }

            <Link href="/login" asChild>
                <Button mode="text">Already have an account? Login</Button>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 16,
    },
    title: {
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        marginBottom: 8,
    },
    button: {
        marginTop: 16,
        marginBottom: 8,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 8,
        marginLeft: 4,
    },
}); 