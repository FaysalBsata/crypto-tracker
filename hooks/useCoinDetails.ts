import { fetchCoinOHLC } from '@/services/api';
import { useCallback, useEffect, useState } from 'react';

type ChartDataPoint = {
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
};

export function useCoinDetails(coinId: string) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchChartData = useCallback(
    async (days: number | string = 30) => {
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
    },
    [coinId]
  );

  useEffect(() => {
    fetchChartData();
  }, [coinId, fetchChartData]);

  return {
    chartData,
    loading,
    error,
    fetchChartData,
  };
}
