import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter, useSegments } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

// Define the route segments type
type RouteSegment = string | undefined;

// Define the authentication group type
type AuthGroup =
  | '(tabs)'
  | 'portfolio'
  | 'settings'
  | 'watchlist'
  | 'coin-details'
  | '_sitemap'
  | '+not-found'
  | '(auth)';

interface AuthContextType {
  isAuthenticated: boolean;
  isBiometricSupported: boolean;
  hasCheckedAuth: boolean;
  isLoading: boolean;
  error: string | null;
  authenticate: () => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isBiometricSupported: false,
  hasCheckedAuth: false,
  isLoading: false,
  error: null,
  authenticate: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  useEffect(() => {
    if (!hasCheckedAuth) return;

    const currentSegment = segments[0] as RouteSegment;
    const isAuthRoute = !currentSegment;
    const isProtectedRoute = currentSegment && currentSegment !== '(auth)';

    if (isAuthenticated && isAuthRoute) {
      router.replace('/(tabs)');
    } else if (!isAuthenticated && isProtectedRoute) {
      console.log('Redirecting to login');
      // router.replace('/');
    }
  }, [isAuthenticated, hasCheckedAuth, segments]);

  const checkBiometricSupport = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (Platform.OS === 'web') {
        setIsBiometricSupported(false);
        setHasCheckedAuth(true);
        setIsAuthenticated(true);
        return;
      }

      const [compatible, enrolled] = await Promise.all([
        LocalAuthentication.hasHardwareAsync(),
        LocalAuthentication.isEnrolledAsync(),
      ]);

      setIsBiometricSupported(compatible && enrolled);
      setHasCheckedAuth(true);
    } catch (error) {
      console.error('Error checking biometric support:', error);
      setError('Failed to check biometric support');
      setIsBiometricSupported(false);
      setHasCheckedAuth(true);
    } finally {
      setIsLoading(false);
    }
  };

  const authenticate = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (Platform.OS === 'web') {
        setIsAuthenticated(true);
        return true;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access your crypto portfolio',
        fallbackLabel: 'Enter passcode',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      setIsAuthenticated(result.success);
      if (!result.success) {
        setError('Authentication failed');
      }
      return result.success;
    } catch (error) {
      console.error('Authentication error:', error);
      setError('Authentication failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isBiometricSupported,
        hasCheckedAuth,
        isLoading,
        error,
        authenticate,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
