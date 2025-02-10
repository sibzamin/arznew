import React from 'react';
import { PriceCard } from './PriceCard';
import { PriceData } from '../types';

interface PriceSectionProps {
  title: string;
  data: PriceData[];
}

export const PriceSection: React.FC<PriceSectionProps> = ({ title, data }) => {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data.map((item) => (
          <PriceCard key={item.name} data={item} />
        ))}
      </div>
    </section>
  );
}
