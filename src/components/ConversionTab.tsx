import React, { useState, useMemo } from 'react';
import { MarketData } from '../types';

interface ConversionTabProps {
  data: MarketData;
}

export const ConversionTab: React.FC<ConversionTabProps> = ({ data }) => {
  const [fromType, setFromType] = useState<'gold' | 'currency' | 'cryptocurrency'>('currency');
  const [toType, setToType] = useState<'gold' | 'currency' | 'cryptocurrency'>('currency');
  const [fromItem, setFromItem] = useState('');
  const [toItem, setToItem] = useState('');
  const [amount, setAmount] = useState<number>(1);

  const allItems = useMemo(() => {
    return {
      gold: data.gold,
      currency: data.currency,
      cryptocurrency: data.cryptocurrency
    };
  }, [data]);

  const selectedFromItem = allItems[fromType].find(item => item.name === fromItem);
  const selectedToItem = allItems[toType].find(item => item.name === toItem);

  const convertedAmount = useMemo(() => {
    if (!selectedFromItem || !selectedToItem) return null;
    const fromValueInToman = selectedFromItem.unit === 'دلار' 
      ? selectedFromItem.price * data.currency[0].price 
      : selectedFromItem.price;
    const toValueInToman = selectedToItem.unit === 'دلار'
      ? selectedToItem.price * data.currency[0].price
      : selectedToItem.price;
    return (amount * fromValueInToman) / toValueInToman;
  }, [selectedFromItem, selectedToItem, amount, data.currency]);

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h2 className="text-2xl font-bold mb-6">تبدیل ارز و طلا</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-bold mb-4">از:</h3>
          <select
            className="w-full p-2 border rounded mb-4"
            value={fromType}
            onChange={(e) => {
              setFromType(e.target.value as any);
              setFromItem('');
            }}
          >
            <option value="currency">ارز</option>
            <option value="gold">طلا و سکه</option>
            <option value="cryptocurrency">ارز دیجیتال</option>
          </select>
          <select
            className="w-full p-2 border rounded mb-4"
            value={fromItem}
            onChange={(e) => setFromItem(e.target.value)}
          >
            <option value="">انتخاب کنید</option>
            {allItems[fromType].map(item => (
              <option key={item.name} value={item.name}>{item.name}</option>
            ))}
          </select>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full p-2 border rounded"
            min="0"
            step="any"
          />
        </div>
        <div>
          <h3 className="text-lg font-bold mb-4">به:</h3>
          <select
            className="w-full p-2 border rounded mb-4"
            value={toType}
            onChange={(e) => {
              setToType(e.target.value as any);
              setToItem('');
            }}
          >
            <option value="currency">ارز</option>
            <option value="gold">طلا و سکه</option>
            <option value="cryptocurrency">ارز دیجیتال</option>
          </select>
          <select
            className="w-full p-2 border rounded mb-4"
            value={toItem}
            onChange={(e) => setToItem(e.target.value)}
          >
            <option value="">انتخاب کنید</option>
            {allItems[toType].map(item => (
              <option key={item.name} value={item.name}>{item.name}</option>
            ))}
          </select>
          {convertedAmount !== null && (
            <div className="p-4 bg-blue-50 rounded">
              <p className="text-lg">
                {amount.toLocaleString('fa-IR')} {selectedFromItem?.name} =
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {convertedAmount.toLocaleString('fa-IR')} {selectedToItem?.name}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
