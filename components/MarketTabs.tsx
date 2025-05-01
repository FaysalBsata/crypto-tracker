import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface MarketTabsProps {
  tabs: string[];
  activeTab: number;
  onTabChange: (index: number) => void;
}

export default function MarketTabs({ tabs, activeTab, onTabChange }: MarketTabsProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={tab}
          style={[
            styles.tab,
            index === activeTab && [
              styles.activeTab,
              { backgroundColor: colors.primary }
            ]
          ]}
          onPress={() => onTabChange(index)}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: index === activeTab ? 'white' : colors.subtext,
                fontFamily: index === activeTab ? 'Inter-SemiBold' : 'Inter-Regular',
              },
            ]}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginVertical: 16,
    borderWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
  },
});