import { useState, useEffect, useCallback } from 'react';
import { fetchCoinById, fetchCoinOHLC } from '@/services/api';
import { Coin } from './useCoinData';

type ChartDataPoint = {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

export function useCoinDetails(coinId: string) {
  const [coin, setCoin] = useState<Coin | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCoinData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchCoinById(coinId);
      setCoin(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [coinId]);

  const fetchChartData = useCallback(async (days: number | string = 30) => {
    try {
      setLoading(true);
      const data = await fetchCoinOHLC(coinId, days);
      setChartData(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [coinId]);

  useEffect(() => {
    fetchCoinData();
    fetchChartData();
  }, [coinId, fetchCoinData, fetchChartData]);

  return {
    coin,
    chartData,
    loading,
    error,
    fetchCoinData,
    fetchChartData
  };
}