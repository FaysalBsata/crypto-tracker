import { Coin } from '@/hooks/useCoinData';
import axios from 'axios';

const BASE_URL = 'https://coingeko.burjx.com';

export async function fetchAllCoins(page = 1, pageSize = 20) {
  try {
    const response = await axios.get(`${BASE_URL}/coin-prices-all`, {
      params: {
        currency: 'usd',
        page,
        pageSize,
      },
    });

    // Ensure we have the sparkline data for the charts
    const coins = response.data.data.map((coin: any) => ({
      ...coin,
      sparkline: coin.sparkline || {
        price: generateMockSparkline(
          coin.price_change_percentage_7d_in_currency
        ),
      },
    }));

    return coins;
  } catch (error) {
    console.error('Error fetching all coins:', error);
    throw new Error('Failed to fetch coin data');
  }
}

export async function fetchCoinById(coinId: string) {
  try {
    // In a real app, we would call a specific endpoint
    // For this demo, we'll get all coins and filter
    const response = await axios.get(`${BASE_URL}/coin-prices-all`, {
      params: {
        currency: 'usd',
        page: 1,
        pageSize: 50,
      },
    });

    const coin = response.data.find((c: Coin) => c.id === coinId);

    if (!coin) {
      throw new Error(`Coin with ID ${coinId} not found`);
    }

    return coin;
  } catch (error) {
    console.error(`Error fetching coin ${coinId}:`, error);
    throw new Error('Failed to fetch coin details');
  }
}

export async function fetchCoinOHLC(
  coinId: string,
  days: number | string = 30
) {
  try {
    const response = await axios.get(`${BASE_URL}/coin-ohlc`, {
      params: {
        productId: coinId,
        days,
      },
    });

    return response.data.map((item: any) => ({
      date: item.date,
      usd: {
        open: item.usd.open,
        high: item.usd.high,
        low: item.usd.low,
        close: item.usd.close,
      },
      aed: {
        open: item.aed.open,
        high: item.aed.high,
        low: item.aed.low,
        close: item.aed.close,
      },
    }));
  } catch (error) {
    console.error(`Error fetching OHLC data for ${coinId}:`, error);
    throw new Error('Failed to fetch chart data');
  }
}

// Generate mock sparkline data for demo purposes
function generateMockSparkline(percentChange: number = 0) {
  const length = 100;
  const result = [];

  // Start with a base value
  let value = 1000;

  // Direction based on percent change
  const trend = percentChange >= 0 ? 1 : -1;
  const volatility = (Math.abs(percentChange) / 100) * 5;

  for (let i = 0; i < length; i++) {
    // Add some randomness but maintain the overall trend
    const randomFactor = (Math.random() - 0.5) * volatility;
    const trendFactor = (trend * (i / length) * Math.abs(percentChange)) / 100;
    value = value * (1 + (randomFactor + trendFactor) / 100);
    result.push(value);
  }

  return result;
}
