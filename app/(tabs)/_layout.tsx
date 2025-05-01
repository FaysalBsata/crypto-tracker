import React from 'react';
import { Tabs } from 'expo-router';
import { ChartBar as BarChart2, Chrome as Home, TrendingUp, Settings } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { Platform } from 'react-native';
import { BlurView } from 'expo-blur';

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
            backgroundColor: 'transparent',
            borderTopColor: colors.border,
            elevation: 0,
            height: 60,
            paddingBottom: 20,
            paddingTop: 8,
          },
          default: {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            elevation: 0,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          }
        }),
        tabBarBackground: Platform.OS === 'ios' 
          ? () => (
              <BlurView 
                intensity={isDark ? 40 : 60} 
                tint={isDark ? "dark" : "light"}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
              />
            ) 
          : undefined,
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Market',
          tabBarIcon: ({ color, size }) => <BarChart2 size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="watchlist"
        options={{
          title: 'Watchlist',
          tabBarIcon: ({ color, size }) => <TrendingUp size={size} color={color} />,
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
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}