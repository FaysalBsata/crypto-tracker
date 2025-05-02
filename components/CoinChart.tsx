import { useTheme } from '@/context/ThemeContext';
import { format } from 'date-fns';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Area, CartesianChart, Line } from 'victory-native';

interface ChartDataPoint {
  date: number;
  usd: {
    open: number;
    high: number;
    low: number;
    close: number;
  };
  aed: {
    open: number;
    high: number;
    low: number;
    close: number;
  };
}

interface CoinChartProps {
  data: ChartDataPoint[];
  type: string;
  priceColor: string;
  currency?: 'usd' | 'aed';
}

export default function CoinChart({
  data,
  type,
  priceColor,
  currency = 'usd',
}: CoinChartProps) {
  const { colors } = useTheme();
  const screenWidth = Dimensions.get('window').width - 32; // Account for padding

  if (!data || data.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.emptyText, { color: colors.subtext }]}>
          No chart data available
        </Text>
      </View>
    );
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return format(date, 'MM/dd');
  };

  // Format data for the chart
  const chartData = data.map((point) => ({
    date: point.date,
    value: point[currency].close,
    open: point[currency].open,
    high: point[currency].high,
    low: point[currency].low,
  }));

  return (
    <View style={styles.container}>
      <View
        style={[styles.chartContainer, { width: screenWidth, height: 280 }]}
      >
        <CartesianChart
          data={chartData}
          xKey="date"
          yKeys={['value']}
          axisOptions={{
            formatXLabel: (value) => formatDate(value),
            formatYLabel: (value) => value.toFixed(2),
            tickCount: { x: 5, y: 5 },
          }}
        >
          {({ points }) =>
            type === 'line' ? (
              <Area
                points={points.value}
                color={priceColor}
                opacity={0.2}
                y0={0}
              />
            ) : (
              <Line points={points.value} color={priceColor} strokeWidth={2} />
            )
          }
        </CartesianChart>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  chartContainer: {
    overflow: 'hidden',
  },
  emptyContainer: {
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 14,
  },
});
