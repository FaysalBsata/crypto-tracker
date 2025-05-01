import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeType;
  isDark: boolean;
  setTheme: (theme: ThemeType) => void;
  colors: {
    background: string;
    card: string;
    text: string;
    subtext: string;
    primary: string;
    secondary: string;
    positive: string;
    negative: string;
    border: string;
    shadow: string;
  };
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  isDark: false,
  setTheme: () => {},
  colors: {
    background: '#FFFFFF',
    card: '#FFFFFF',
    text: '#1A2B6D',
    subtext: '#64748B',
    primary: '#1A2B6D',
    secondary: '#4E9F3D',
    positive: '#4E9F3D',
    negative: '#E11D48',
    border: '#E2E8F0',
    shadow: 'rgba(0, 0, 0, 0.1)'
  }
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>('system');
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    if (theme === 'system') {
      setIsDark(systemColorScheme === 'dark');
    } else {
      setIsDark(theme === 'dark');
    }
  }, [theme, systemColorScheme]);

  const lightColors = {
    background: '#F8FAFC',
    card: '#FFFFFF',
    text: '#1A2B6D',
    subtext: '#64748B',
    primary: '#1A2B6D',
    secondary: '#4E9F3D',
    positive: '#4E9F3D',
    negative: '#E11D48',
    border: '#E2E8F0',
    shadow: 'rgba(0, 0, 0, 0.1)'
  };

  const darkColors = {
    background: '#111827',
    card: '#1E293B',
    text: '#F8FAFC',
    subtext: '#94A3B8',
    primary: '#3B82F6',
    secondary: '#4ADE80',
    positive: '#4ADE80',
    negative: '#FB7185',
    border: '#334155',
    shadow: 'rgba(0, 0, 0, 0.3)'
  };

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        setTheme,
        colors
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};