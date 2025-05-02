import { useTheme } from '@/context/ThemeContext';
import { Star, TrendingDown, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MarketTabsProps {
  tabs: string[];
  activeTab: number;
  onTabChange: (index: number) => void;
}

export default function MarketTabs({
  tabs,
  activeTab,
  onTabChange,
}: MarketTabsProps) {
  const { colors } = useTheme();

  const getTabIcon = (index: number) => {
    switch (index) {
      case 0:
        return (
          <Star
            size={16}
            color={index === activeTab ? 'white' : colors.subtext}
          />
        );
      case 1:
        return (
          <TrendingUp
            size={16}
            color={index === activeTab ? 'white' : colors.subtext}
          />
        );
      case 2:
        return (
          <TrendingDown
            size={16}
            color={index === activeTab ? 'white' : colors.subtext}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={`${tab}-${index}`}
          style={[
            styles.tab,
            index === activeTab && [
              styles.activeTab,
              { backgroundColor: colors.primary },
            ],
          ]}
          onPress={() => onTabChange(index)}
        >
          <View style={styles.tabContent}>
            {getTabIcon(index)}
            <Text
              style={[
                styles.tabText,
                {
                  color: index === activeTab ? 'white' : colors.subtext,
                  fontFamily:
                    index === activeTab ? 'Inter-SemiBold' : 'Inter-Regular',
                },
              ]}
            >
              {tab}
            </Text>
          </View>
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
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
