import CoinListItem from '@/components/CoinListItem';
import HeaderBar from '@/components/HeaderBar';
import MarketTabs from '@/components/MarketTabs';
import { useTheme } from '@/context/ThemeContext';
import { useCoinData } from '@/hooks/useCoinData';
import { useNavigation, useRouter } from 'expo-router';
import { Search } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TABS = ['Featured', 'Top Gainers', 'Top Losers'];

export default function MarketScreen() {
  const { colors } = useTheme();
  const { coins, loading, error, loadMore, refreshData, filterByType } =
    useCoinData();
  const [activeTab, setActiveTab] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useEffect(() => {
    // Apply filter based on active tab
    if (activeTab === 0) {
      filterByType('market_cap_desc');
    } else if (activeTab === 1) {
      filterByType('top_gainers');
    } else {
      filterByType('top_losers');
    }
  }, [activeTab]);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };
  const router = useRouter();
  const handleCoinPress = (coinId: string) => {
    router.push(`/coin-details?id=${coinId}`);
  };

  if (error) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <HeaderBar title="Market" scrollY={scrollY} />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>
            Error loading market data. Please try again later.
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={refreshData}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderListHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.searchBarContainer}>
        <TouchableOpacity
          style={[
            styles.searchBar,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Search size={18} color={colors.subtext} />
          <Text style={[styles.searchBarText, { color: colors.subtext }]}>
            Search cryptocurrencies...
          </Text>
        </TouchableOpacity>
      </View>

      <MarketTabs
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    </View>
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <HeaderBar title="Market" scrollY={scrollY} />

        <Animated.FlatList
          data={coins}
          renderItem={({ item }) => (
            <CoinListItem
              key={item.id}
              coin={item}
              onPress={() => handleCoinPress(item.productId)}
            />
          )}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={styles.listContent}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListHeaderComponent={renderListHeader}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={loading && coins.length === 0}
              onRefresh={refreshData}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: Platform.OS !== 'web' }
          )}
          scrollEventThrottle={16}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  searchBarContainer: {
    marginVertical: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchBarText: {
    fontFamily: 'Inter-Regular',
    marginLeft: 8,
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 100,
  },
  loaderContainer: {
    paddingVertical: 20,
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
});
