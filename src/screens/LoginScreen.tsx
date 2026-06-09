import React, { useState } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Colors, Typography } from '../constants/colors';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import { Ionicons } from '@expo/vector-icons';

export const LoginScreen: React.FC = () => {
  const { login, register } = useAuth();
  const { showToast } = useToast();
  
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Validation States
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Email format regex
  const validateEmail = (text: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!text.trim()) {
      return 'Email is required';
    } else if (!emailRegex.test(text.trim())) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (text: string) => {
    if (!text) {
      return 'Password is required';
    } else if (text.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return '';
  };

  const validateConfirmPassword = (text: string) => {
    if (isSignUpMode) {
      if (!text) {
        return 'Please confirm your password';
      } else if (text !== password) {
        return 'Passwords do not match';
      }
    }
    return '';
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (hasSubmitted) {
      setEmailError(validateEmail(text));
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (hasSubmitted) {
      setPasswordError(validatePassword(text));
      if (isSignUpMode && confirmPassword) {
        setConfirmPasswordError(text === confirmPassword ? '' : 'Passwords do not match');
      }
    }
  };

  const toggleAuthMode = () => {
    setIsSignUpMode(prev => !prev);
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setHasSubmitted(false);
    setPassword('');
    setConfirmPassword('');
  };

  const handleAuth = async () => {
    setHasSubmitted(true);
    const emailValError = validateEmail(email);
    const passValError = validatePassword(password);
    const confirmPassValError = isSignUpMode ? validateConfirmPassword(confirmPassword) : '';

    setEmailError(emailValError);
    setPasswordError(passValError);
    setConfirmPasswordError(confirmPassValError);

    if (emailValError || passValError || confirmPassValError) {
      return;
    }

    setIsLoading(true);
    try {
      // Small simulated delay for modern feels
      await new Promise(resolve => setTimeout(resolve, 800));
      if (isSignUpMode) {
        await register(email.trim(), password);
        showToast('Account created successfully!', 'success');
      } else {
        await login(email.trim(), password);
        showToast('Logged in successfully!', 'success');
      }
    } catch (error: any) {
      showToast(error.message || 'Authentication failed. Please check your credentials.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Brand/Logo Section */}
        <View style={styles.brandContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="checkbox-outline" size={48} color={Colors.white} />
          </View>
          <Text style={styles.brandTitle}>TaskFlow</Text>
          <Text style={styles.brandSubtitle}>Manage tasks elegantly and efficiently</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          <AppInput
            label="Email Address"
            placeholder="yourname@example.com"
            value={email}
            onChangeText={handleEmailChange}
            error={emailError}
            iconName="mail-outline"
            keyboardType="email-address"
            autoComplete="email"
          />

          <AppInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={handlePasswordChange}
            error={passwordError}
            iconName="lock-closed-outline"
            isPassword={true}
            autoComplete="password"
          />

          {isSignUpMode && (
            <AppInput
              label="Confirm Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (hasSubmitted) {
                  setConfirmPasswordError(validateConfirmPassword(text));
                }
              }}
              error={confirmPasswordError}
              iconName="lock-closed-outline"
              isPassword={true}
              autoComplete="password"
            />
          )}

          <View style={styles.buttonSpacer} />

          <AppButton
            title={isSignUpMode ? 'Create Account' : 'Sign In'}
            onPress={handleAuth}
            isLoading={isLoading}
          />

          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>
              {isSignUpMode ? 'Already have an account?' : "Don't have an account?"}
            </Text>
            <AppButton
              title={isSignUpMode ? 'Sign In' : 'Sign Up'}
              onPress={toggleAuthMode}
              variant="text"
              textStyle={styles.toggleActionText}
            />
          </View>
        </View>


      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 16,
  },
  brandTitle: {
    fontSize: Typography.sizes.title,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginTop: 6,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  buttonSpacer: {
    height: 12,
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
  },
  footerText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  toggleText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginRight: 6,
  },
  toggleActionText: {
    fontWeight: Typography.weights.bold,
  },
});

export default LoginScreen;
