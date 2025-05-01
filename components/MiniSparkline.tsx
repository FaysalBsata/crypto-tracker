import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface MiniSparklineProps {
  data: number[];
  color: string;
  width: number;
  height: number;
}

export default function MiniSparkline({ data, color, width, height }: MiniSparklineProps) {
  if (!data || data.length === 0) return null;
  
  // Filter out any NaN or undefined values
  const validData = data.filter(point => !isNaN(point) && point !== undefined);
  if (validData.length === 0) return null;
  
  // Get min and max for scaling
  const minValue = Math.min(...validData);
  const maxValue = Math.max(...validData);
  const range = maxValue - minValue;
  
  // Avoid division by zero
  const getY = (value: number) => {
    if (range === 0) return height / 2;
    return height - ((value - minValue) / range) * height;
  };
  
  // Generate path
  const points = validData.map((value, index) => {
    const x = (index / (validData.length - 1)) * width;
    const y = getY(value);
    return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
  }).join(' ');
  
  // Generate path for gradient fill
  const fillPath = `${points} L ${width},${height} L 0,${height} Z`;
  
  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="0.2" />
            <Stop offset="1" stopColor={color} stopOpacity="0" />
          </LinearGradient>
        </Defs>
        <Path d={fillPath} fill="url(#grad)" />
        <Path d={points} stroke={color} strokeWidth={1.5} fill="none" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});