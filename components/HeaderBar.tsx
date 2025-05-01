import React from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { BlurView } from 'expo-blur';

interface HeaderBarProps {
  title: string;
  scrollY?: Animated.Value;
}

export default function HeaderBar({ title, scrollY }: HeaderBarProps) {
  const { colors, isDark } = useTheme();
  
  const headerOpacity = scrollY
    ? scrollY.interpolate({
        inputRange: [0, 50, 100],
        outputRange: [0, 0.7, 1],
        extrapolate: 'clamp',
      })
    : new Animated.Value(1);

  return (
    <Animated.View 
      style={[
        styles.headerContainer,
        {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        },
        {
          opacity: headerOpacity
        }
      ]}
    >
      <View style={styles.headerContent}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{title}</Text>
      </View>
      {Platform.OS === 'ios' && (
        <Animated.View style={[styles.blurContainer, { opacity: headerOpacity }]}>
          <BlurView intensity={25} tint={isDark ? 'dark' : 'light'} style={styles.blurView} />
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
  },
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
  },
});