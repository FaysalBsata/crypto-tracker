import { useTheme } from '@/context/ThemeContext';
import { format } from 'date-fns';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import {
  VictoryArea,
  VictoryAxis,
  VictoryCandlestick,
  VictoryChart,
  VictoryTheme,
} from 'victory-native';

// Type declarations for victory-native components
declare module 'victory-native' {
  export const VictoryChart: any;
  export const VictoryAxis: any;
  export const VictoryTheme: any;
  export const VictoryArea: any;
  export const VictoryCandlestick: any;
}

interface ChartDataPoint {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface CandlestickDataPoint {
  x: number;
  open: number;
  close: number;
  high: number;
  low: number;
}

interface CoinChartProps {
  data: ChartDataPoint[];
  type: string;
  priceColor: string;
}

export default function CoinChart({ data, type, priceColor }: CoinChartProps) {
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

  // Format data for VictoryLine
  const lineData = data.map((point) => ({
    x: point.timestamp,
    y: point.close,
  }));

  // Format data for VictoryCandlestick
  const candlestickData = data.map((point) => ({
    x: point.timestamp,
    open: point.open,
    close: point.close,
    high: point.high,
    low: point.low,
  }));

  return (
    <View style={styles.container}>
      {type === 'line' ? (
        <VictoryChart
          width={screenWidth}
          height={280}
          theme={VictoryTheme.material}
          padding={{ top: 10, bottom: 40, left: 50, right: 20 }}
        >
          <VictoryAxis
            tickFormat={formatDate}
            style={{
              axis: { stroke: colors.border },
              tickLabels: { fill: colors.subtext, fontSize: 10 },
            }}
          />
          <VictoryAxis
            dependentAxis
            style={{
              axis: { stroke: colors.border },
              tickLabels: { fill: colors.subtext, fontSize: 10 },
            }}
          />
          <VictoryArea
            data={lineData}
            style={{
              data: {
                fill: `${priceColor}20`,
                stroke: priceColor,
                strokeWidth: 2,
              },
            }}
            animate={{
              duration: 500,
              onLoad: { duration: 500 },
            }}
          />
        </VictoryChart>
      ) : (
        <VictoryChart
          width={screenWidth}
          height={280}
          theme={VictoryTheme.material}
          domainPadding={{ x: 25 }}
          padding={{ top: 10, bottom: 40, left: 50, right: 20 }}
        >
          <VictoryAxis
            tickFormat={formatDate}
            style={{
              axis: { stroke: colors.border },
              tickLabels: { fill: colors.subtext, fontSize: 10 },
            }}
          />
          <VictoryAxis
            dependentAxis
            style={{
              axis: { stroke: colors.border },
              tickLabels: { fill: colors.subtext, fontSize: 10 },
            }}
          />
          <VictoryCandlestick
            data={candlestickData}
            candleColors={{
              positive: colors.positive,
              negative: colors.negative,
            }}
            style={{
              data: {
                stroke: ({ datum }: { datum: CandlestickDataPoint }) =>
                  datum.close > datum.open ? colors.positive : colors.negative,
              },
            }}
            animate={{
              duration: 500,
              onLoad: { duration: 500 },
            }}
          />
        </VictoryChart>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  emptyContainer: {
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  emptyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
});
