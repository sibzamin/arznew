import React, { useState } from 'react';
import { TrendingDown, TrendingUp, Calculator } from 'lucide-react';
import { PriceData } from '../types';

interface PriceCardProps {
  data: PriceData;
}

export const PriceCard: React.FC<PriceCardProps> = ({ data }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const isPositive = data.change_percent > 0;
  const totalPrice = data.price * quantity;

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold">{data.name}</h3>
        {isPositive ? (
          <TrendingUp className="text-green-500" />
        ) : (
          <TrendingDown className="text-red-500" />
        )}
      </div>
      <p className="text-2xl font-bold mb-2">
        {data.price.toLocaleString('fa-IR')} {data.unit}
      </p>
      <div className="flex items-center gap-2 mb-2">
        <Calculator className="w-4 h-4" />
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-20 p-1 border rounded text-center"
          min="1"
        />
        <span>×</span>
      </div>
      <p className="text-lg text-blue-600 mb-2">
        {totalPrice.toLocaleString('fa-IR')} {data.unit}
      </p>
      <div className="flex justify-between text-sm">
        <span className={`${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {data.change_percent.toLocaleString('fa-IR')}٪
        </span>
        <span className="text-gray-500">
          {data.time}
        </span>
      </div>
    </div>
  );
}
