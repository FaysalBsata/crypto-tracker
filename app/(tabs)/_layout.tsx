import { useTheme } from '@/context/ThemeContext';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import {
  ChartBar as BarChart2,
  Chrome as Home,
  Settings,
  TrendingUp,
} from 'lucide-react-native';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
  const { colors, isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtext,
        tabBarStyle: Platform.select({
          ios: {
            borderTopColor: colors.border,
            elevation: 0,
            paddingBottom: 20,
            paddingTop: 8,
            backgroundColor: colors.background,
          },
          default: {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            elevation: 0,
            paddingBottom: 8,
            paddingTop: 8,
          },
        }),
        tabBarBackground:
          Platform.OS === 'ios'
            ? () => (
                <BlurView
                  intensity={isDark ? 40 : 60}
                  tint={isDark ? 'systemThickMaterialDark' : 'light'}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                />
              )
            : undefined,
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Market',
          tabBarIcon: ({ color, size }) => (
            <BarChart2 size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="watchlist"
        options={{
          title: 'Watchlist',
          tabBarIcon: ({ color, size }) => (
            <TrendingUp size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
          title: 'Portfolio',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
