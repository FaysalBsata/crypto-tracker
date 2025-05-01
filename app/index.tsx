import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Fingerprint, Lock, ChevronRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthScreen() {
  const { authenticate, isAuthenticated, isBiometricSupported, hasCheckedAuth } = useAuth();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  const handleAuthenticate = async () => {
    const success = await authenticate();
    if (success) {
      router.replace('/(tabs)');
    }
  };

  if (!hasCheckedAuth) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // For web demo, redirect automatically
  if (Platform.OS === 'web') {
    router.replace('/(tabs)');
    return null;
  }

  return (
    <LinearGradient
      colors={isDark ? ['#0F172A', '#1E293B'] : ['#EFF6FF', '#DBEAFE']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.logoContainer}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }} 
            style={styles.logo}
          />
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={[styles.title, { color: colors.text }]}>CryptoTracker</Text>
          <Text style={[styles.subtitle, { color: colors.subtext }]}>
            Your personal cryptocurrency market tracker with real-time updates and detailed analytics.
          </Text>
          
          <View style={styles.authContainer}>
            {isBiometricSupported ? (
              <TouchableOpacity
                style={[styles.authButton, { backgroundColor: colors.primary }]}
                onPress={handleAuthenticate}
              >
                <Fingerprint color="#FFFFFF" size={28} />
                <Text style={styles.authButtonText}>Authenticate with Biometrics</Text>
                <ChevronRight color="#FFFFFF" size={20} />
              </TouchableOpacity>
            ) : (
              <View style={styles.bioNotSupportedContainer}>
                <View style={[styles.infoBox, { backgroundColor: colors.card }]}>
                  <Lock color={colors.primary} size={24} />
                  <Text style={[styles.infoText, { color: colors.text }]}>
                    Biometric authentication is not set up on your device.
                  </Text>
                </View>
                
                <TouchableOpacity
                  style={[styles.authButton, { backgroundColor: colors.primary }]}
                  onPress={() => router.replace('/(tabs)')}
                >
                  <Text style={styles.authButtonText}>Continue without Biometrics</Text>
                  <ChevronRight color="#FFFFFF" size={20} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 30,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 40,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  authContainer: {
    marginTop: 20,
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  authButtonText: {
    color: 'white',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  bioNotSupportedContainer: {
    alignItems: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    flex: 1,
    marginLeft: 12,
  },
});