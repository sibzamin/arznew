export interface PriceData {
  date: string;
  time: string;
  name: string;
  price: number;
  change_percent: number;
  unit: string;
}

export interface MarketData {
  gold: PriceData[];
  currency: PriceData[];
  cryptocurrency: PriceData[];
}

export interface ConversionData {
  from: PriceData;
  to: PriceData;
  amount: number;
}
