import CoinChart from '@/components/CoinChart';
import CoinStats from '@/components/CoinStats';
import { useTheme } from '@/context/ThemeContext';
import { Coin } from '@/hooks/useCoinData';
import { useCoinDetails } from '@/hooks/useCoinDetails';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Share2, Star } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CHART_TYPES = ['Line', 'Candlestick'];
const TIME_PERIODS = ['1D', '7D', '30D', '1Y'];

export default function CoinDetailsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id, coinData } = useLocalSearchParams();
  const [chartType, setChartType] = useState(CHART_TYPES[0]);
  const [timePeriod, setTimePeriod] = useState('30D');
  const [currency, setCurrency] = useState<'usd' | 'aed'>('usd');

  const coin = coinData ? (JSON.parse(coinData as string) as Coin) : null;
  const { chartData, loading, error, fetchChartData } = useCoinDetails(
    id as string
  );

  // Transform the data to match the expected format
  const transformedChartData = chartData.map((item) => ({
    date: item.date,
    usd: item.usd,
    aed: item.aed,
  }));

  useEffect(() => {
    let days: number | string = 30;
    switch (timePeriod) {
      case '1D':
        days = 1;
        break;
      case '7D':
        days = 7;
        break;
      case '30D':
        days = 30;
        break;
      case '1Y':
        days = 365;
        break;
      case 'All':
        days = 'max';
        break;
    }
    fetchChartData(days);
  }, [timePeriod]);

  const handleGoBack = () => {
    router.back();
  };

  if (loading && !coin) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Loading...
          </Text>
          <View style={styles.rightPlaceholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !coin) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Error
          </Text>
          <View style={styles.rightPlaceholder} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>
            Error loading coin data. Please try again.
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const priceChangeColor =
    coin?.priceChangePercentage24h >= 0 ? colors.positive : colors.negative;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Image source={{ uri: coin?.image }} style={styles.coinIcon} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {coin?.name}
          </Text>
          <Text style={[styles.headerSymbol, { color: colors.subtext }]}>
            {coin?.symbol?.toUpperCase()}
          </Text>
        </View>
        <TouchableOpacity style={styles.starButton}>
          <Star size={22} color={colors.subtext} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: colors.text }]}>
            {formatCurrency(coin?.currentPrice)}
          </Text>
          <View
            style={[
              styles.priceChangeContainer,
              { backgroundColor: priceChangeColor + '20' },
            ]}
          >
            <Text style={[styles.priceChange, { color: priceChangeColor }]}>
              {formatPercent(coin?.priceChangePercentage24h)}
            </Text>
          </View>

          <TouchableOpacity style={styles.shareButton}>
            <Share2 size={20} color={colors.subtext} />
          </TouchableOpacity>
        </View>

        <View style={styles.chartTypeContainer}>
          <View
            style={[
              styles.chartTypeSelectorContainer,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            {CHART_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.chartTypeButton,
                  chartType === type && {
                    backgroundColor: colors.primary + '20',
                  },
                ]}
                onPress={() => setChartType(type)}
              >
                <Text
                  style={[
                    styles.chartTypeText,
                    {
                      color:
                        chartType === type ? colors.primary : colors.subtext,
                      fontFamily:
                        chartType === type ? 'Inter-SemiBold' : 'Inter-Medium',
                    },
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.timePeriodContainer}>
          {TIME_PERIODS.map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.timePeriodButton,
                timePeriod === period && {
                  borderBottomColor: colors.primary,
                  borderBottomWidth: 2,
                },
              ]}
              onPress={() => setTimePeriod(period)}
            >
              <Text
                style={[
                  styles.timePeriodText,
                  {
                    color:
                      timePeriod === period ? colors.primary : colors.subtext,
                    fontFamily:
                      timePeriod === period ? 'Inter-SemiBold' : 'Inter-Medium',
                  },
                ]}
              >
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.chartContainer}>
          {loading ? (
            <ActivityIndicator
              size="large"
              color={colors.primary}
              style={{ marginTop: 40 }}
            />
          ) : (
            <CoinChart
              data={transformedChartData}
              type={chartType.toLowerCase()}
              priceColor={priceChangeColor}
              currency={currency}
            />
          )}
        </View>

        <View style={styles.currencySelector}>
          <TouchableOpacity
            style={[
              styles.currencyButton,
              currency === 'usd' && { backgroundColor: colors.primary + '20' },
            ]}
            onPress={() => setCurrency('usd')}
          >
            <Text
              style={[
                styles.currencyText,
                {
                  color: currency === 'usd' ? colors.primary : colors.subtext,
                  fontFamily:
                    currency === 'usd' ? 'Inter-SemiBold' : 'Inter-Medium',
                },
              ]}
            >
              USD
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.currencyButton,
              currency === 'aed' && { backgroundColor: colors.primary + '20' },
            ]}
            onPress={() => setCurrency('aed')}
          >
            <Text
              style={[
                styles.currencyText,
                {
                  color: currency === 'aed' ? colors.primary : colors.subtext,
                  fontFamily:
                    currency === 'aed' ? 'Inter-SemiBold' : 'Inter-Medium',
                },
              ]}
            >
              AED
            </Text>
          </TouchableOpacity>
        </View>

        <CoinStats coin={coin} />

        <View style={styles.aboutContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            About {coin?.name}
          </Text>
          <Text style={[styles.aboutText, { color: colors.subtext }]}>
            {`${
              coin?.name
            } is a cryptocurrency with the symbol ${coin?.symbol?.toUpperCase()}. It is currently ranked #${
              coin?.market_cap_rank
            } by market capitalization.`}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
  },
  headerSymbol: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginLeft: 6,
  },
  coinIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
    borderRadius: 12,
  },
  rightPlaceholder: {
    width: 40,
  },
  starButton: {
    padding: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  price: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
  },
  priceChangeContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 12,
  },
  priceChange: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  shareButton: {
    marginLeft: 'auto',
    padding: 8,
    borderRadius: 8,
  },
  chartTypeContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTypeSelectorContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  chartTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  chartTypeText: {
    fontSize: 14,
  },
  timePeriodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  timePeriodButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  timePeriodText: {
    fontSize: 14,
  },
  chartContainer: {
    height: 300,
    marginBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    fontSize: 14,
  },
  aboutContainer: {
    marginTop: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 8,
  },
  aboutText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 22,
  },
  currencySelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  currencyButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  currencyText: {
    fontSize: 14,
  },
});
