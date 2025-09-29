import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter } from "expo-router"
import * as SecureStore from "expo-secure-store";
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import { API_BASE_URL } from '@/config';


const AuthScreen = () => {
  const router = useRouter();
  const [loading2, setLoading2] = useState(false);
  // useEffect(() => {
  //   const checkToken = async () => {
  //     try {
  //       const token = await SecureStore.getItemAsync('token');
  //       const roleStored = await SecureStore.getItemAsync('role');

  //       if (token && roleStored) {
  //         // Redirect automatically
  //         if (roleStored === 'patient') router.replace('/patients/home');
  //         else router.replace('./doctor/home'); // change if doctor landing page differs
  //       }
  //     } catch (err) {
  //       console.log('Error checking token:', err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   checkToken();
  // }, []);

  if (loading2) {
    // Show loading spinner while checking token
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#13abec" />
      </View>
    );
  }
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [loading, setLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('patient'); // 'patient' or 'doctor'
  
  // Dropdown state
  const [openRoleDropdown, setOpenRoleDropdown] = useState(false);
  const [roleItems, setRoleItems] = useState([
    { label: 'Patient', value: 'patient' },
    { label: 'Doctor', value: 'doctor' },
  ]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Email is required');
      return false;
    }
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email');
      return false;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Password is required');
      return false;
    }
    if (password.length < 6 && authMode==='signup') {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    if (authMode === 'signup') {
      if (!confirmPassword.trim()) {
        Alert.alert('Error', 'Please confirm your password');
        return false;
      }
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return false;
      }
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: email.trim(),
        password,
      });
      if (response.data.access_token) {
        await SecureStore.setItemAsync("token", response.data.access_token);
        await SecureStore.setItemAsync("role", response.data.role);
        await SecureStore.setItemAsync("email", response.data.email);
        Alert.alert('Success', 'Login successful!', [
          { text: 'OK', onPress: () => console.log('Login:', response.data) },
        ]);

        if (response.data.role === "patient") {
          router.replace("./patients");
        } else {
          router.replace("./doctor");
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
        email: email.trim(),
        password,
        confirm_password:confirmPassword,
        role,
      });
      if (response.data.access_token) {
        await SecureStore.setItemAsync("token", response.data.access_token);
        await SecureStore.setItemAsync("role", response.data.role);
        await SecureStore.setItemAsync("email",response.data.email);
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => {
            setAuthMode('login');
            setConfirmPassword('');
          }},
        ]);

        if (response.data.role === "patient") {
          router.replace("./patients");
        } else {
          router.replace("./doctor");
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Signup failed.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim() || !validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, {
        email: email.trim(),
      });
      if (response.data.success) {
        Alert.alert('Success', 'Password reset instructions sent!');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send reset email.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setRole('patient');
  };

  const switchAuthMode = (mode) => {
    setAuthMode(mode);
    resetForm();
  };


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.logo}>HealthBridge AI</Text>
          </View>

          <View style={styles.content}>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeTitle}>
                {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
              </Text>
              <Text style={styles.welcomeSubtitle}>
                Login or create an account to get started.
              </Text>
            </View>

            <View style={styles.authToggle}>
              <TouchableOpacity
                style={[styles.toggleButton, authMode === 'login' && styles.toggleButtonActive]}
                onPress={() => switchAuthMode('login')}
              >
                <Text style={[styles.toggleButtonText, authMode === 'login' && styles.toggleButtonTextActive]}>
                  Login
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, authMode === 'signup' && styles.toggleButtonActive]}
                onPress={() => switchAuthMode('signup')}
              >
                <Text style={[styles.toggleButtonText, authMode === 'signup' && styles.toggleButtonTextActive]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Email or Username"
                placeholderTextColor="#4c829a"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#4c829a"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />

              {authMode === 'signup' && (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    placeholderTextColor="#4c829a"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    autoCapitalize="none"
                  />

                  <View style={{ marginTop: 12, zIndex: 1000, elevation: 1000  }}>
                    <Text style={styles.pickerLabel}>Role</Text>
                    <DropDownPicker
                      open={openRoleDropdown}
                      value={role}
                      items={roleItems}
                      setOpen={setOpenRoleDropdown}
                      setValue={setRole}
                      setItems={setRoleItems}
                      placeholder="Select Role"
                      style={styles.dropdown}
                      dropDownContainerStyle={{ backgroundColor: '#e7f0f3', borderRadius: 12, borderWidth: 0}}
                      textStyle={{ color: '#0d171b', fontSize: 16 }}
                      listMode='FLATLIST' 
                    />
                  </View>
                </>
              )}

              {authMode === 'login' && (
                <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword} disabled={loading}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={authMode === 'login' ? handleLogin : handleSignup}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#ffffff" /> : (
                  <Text style={styles.submitButtonText}>
                    {authMode === 'login' ? 'Login' : 'Sign Up'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f7f8' },
  keyboardAvoid: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center' },
  header: { paddingVertical: 24, paddingHorizontal: 16, alignItems: 'center' },
  logo: { fontSize: 24, fontWeight: 'bold', color: '#0d171b' },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 16 },
  welcomeSection: { marginBottom: 24, alignItems: 'center' },
  welcomeTitle: { fontSize: 32, fontWeight: 'bold', color: '#0d171b', textAlign: 'center' },
  welcomeSubtitle: { fontSize: 16, color: '#4c829a', textAlign: 'center', marginTop: 8 },
  authToggle: { flexDirection: 'row', backgroundColor: '#e7f0f3', borderRadius: 12, padding: 4, marginBottom: 24 },
  toggleButton: { flex: 1, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, alignItems: 'center' },
  toggleButtonActive: { backgroundColor: '#f6f7f8', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  toggleButtonText: { fontSize: 16, color: '#4c829a' },
  toggleButtonTextActive: { color: '#0d171b', fontWeight: '600' },
  form: { gap: 16 },
  input: { height: 56, backgroundColor: '#e7f0f3', borderRadius: 12, paddingHorizontal: 16, fontSize: 16, color: '#0d171b', borderWidth: 0 },
  pickerLabel: { fontSize: 16, fontWeight: '500', color: '#0d171b', marginBottom: 4 },
  dropdown: { backgroundColor: '#e7f0f3', borderRadius: 12, borderWidth: 0 },
  forgotPassword: { alignSelf: 'flex-end', paddingVertical: 4 },
  forgotPasswordText: { fontSize: 14, color: '#4c829a' },
  submitButton: { height: 56, backgroundColor: '#13abec', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  submitButtonDisabled: { opacity: 0.7 },
  submitButtonText: { fontSize: 16, fontWeight: 'bold', color: '#ffffff' },
});

export default AuthScreen;
