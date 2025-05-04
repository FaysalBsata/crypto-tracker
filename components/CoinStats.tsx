import { useTheme } from '@/context/ThemeContext';
import { Coin } from '@/hooks/useCoinData';
import { formatCurrency } from '@/utils/formatters';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface CoinStatsProps {
  coin: Coin;
}

export default function CoinStats({ coin }: CoinStatsProps) {
  const { colors } = useTheme();

  const stats = [
    {
      label: 'Market Cap',
      value: formatCurrency(coin?.marketCap),
    },
    {
      label: 'Volume',
      value: formatCurrency(coin?.tradingVolume),
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Statistics
      </Text>

      <View
        style={[
          styles.statsTable,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        {stats.map((stat, index) => (
          <View
            key={index}
            style={[
              styles.statsRow,
              index !== stats.length - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.statsLabel, { color: colors.subtext }]}>
              {stat.label}
            </Text>
            <Text style={[styles.statsValue, { color: colors.text }]}>
              {stat.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 12,
  },
  statsTable: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  statsLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  statsValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
});
