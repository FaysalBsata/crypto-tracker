import { useTheme } from '@/context/ThemeContext';
import { Coin } from '@/hooks/useCoinData';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import React, { memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MiniSparkline from './MiniSparkline';

interface CoinListItemProps {
  coin: Coin;
  onPress: () => void;
}

function CoinListItem({ coin, onPress }: CoinListItemProps) {
  const { colors } = useTheme();

  const priceChangeColor =
    coin.priceChangePercentage24h >= 0 ? colors.positive : colors.negative;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        <Image source={{ uri: coin.image }} style={styles.coinImage} />
        <View style={styles.nameContainer}>
          <Text
            style={[styles.coinName, { color: colors.text }]}
            numberOfLines={1}
          >
            {coin.name}
          </Text>
          <Text style={[styles.coinSymbol, { color: colors.subtext }]}>
            {coin.symbol.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.middleContent}>
        {coin.sparkline && (
          <MiniSparkline
            data={coin.sparkline}
            color={priceChangeColor}
            width={80}
            height={40}
          />
        )}
      </View>

      <View style={styles.rightContent}>
        <Text style={[styles.price, { color: colors.text }]}>
          {formatCurrency(coin.currentPrice)}
        </Text>
        <Text style={[styles.priceChange, { color: priceChangeColor }]}>
          {formatPercent(coin.priceChangePercentage24h)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  coinImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  nameContainer: {
    marginLeft: 12,
    flex: 1,
  },
  coinName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  coinSymbol: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    marginTop: 2,
  },
  middleContent: {
    flex: 1,
    alignItems: 'center',
  },
  rightContent: {
    alignItems: 'flex-end',
    flex: 1,
  },
  price: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  priceChange: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginTop: 4,
  },
});

export default memo(CoinListItem);
