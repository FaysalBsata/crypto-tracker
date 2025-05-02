import { fetchAllCoins } from '@/services/api';
import { useCallback, useEffect, useState } from 'react';

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  currentPrice: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  priceChangePercentage24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
  sparkline?: number[];
}

type SortType =
  | 'market_cap_desc'
  | 'volume_desc'
  | 'top_gainers'
  | 'top_losers';

export function useCoinData() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortType, setSortType] = useState<SortType>('market_cap_desc');
  const [allCoinsCache, setAllCoinsCache] = useState<Coin[]>([]);

  const fetchCoins = useCallback(
    async (reset = false) => {
      if (reset) {
        setCoins([]);
        setPage(1);
        setHasMore(true);
      }

      if (!hasMore && !reset) return;

      try {
        setLoading(true);
        const pageToFetch = reset ? 1 : page;
        const newCoins = await fetchAllCoins(pageToFetch, 20);

        // Cache all fetched coins for filtering later
        if (reset) {
          setAllCoinsCache(newCoins);
        } else {
          setAllCoinsCache((prev) => [...prev, ...newCoins]);
        }

        setCoins((prev) => {
          if (reset) return newCoins;
          return [...prev, ...newCoins];
        });

        setHasMore(newCoins.length === 20);
        setPage((prev) => prev + 1);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    },
    [page, hasMore]
  );

  useEffect(() => {
    fetchCoins();
  }, []);

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchCoins();
    }
  };

  const refreshData = () => {
    fetchCoins(true);
  };

  const filterByType = (type: SortType) => {
    setSortType(type);
    setLoading(true);

    // Apply filter to the cached data
    let filteredCoins = [...allCoinsCache];

    switch (type) {
      case 'market_cap_desc':
        filteredCoins.sort((a, b) => b.market_cap - a.market_cap);
        break;
      case 'volume_desc':
        filteredCoins.sort((a, b) => b.total_volume - a.total_volume);
        break;
      case 'top_gainers':
        filteredCoins.sort(
          (a, b) => b.priceChangePercentage24h - a.priceChangePercentage24h
        );
        break;
      case 'top_losers':
        filteredCoins.sort(
          (a, b) => a.priceChangePercentage24h - b.priceChangePercentage24h
        );
        break;
    }

    setCoins(filteredCoins);
    setLoading(false);
  };

  return { coins, loading, error, loadMore, refreshData, filterByType };
}
