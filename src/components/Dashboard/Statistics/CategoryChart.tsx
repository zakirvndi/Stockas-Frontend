'use client'
import { TransactionType } from '@/app/types/transaction';
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default React.memo(function CategoryChart({ 
  transactions = [] 
}: { 
  transactions: TransactionType[] 
}) {
  const { topCategories, total } = React.useMemo(() => {
    if (!transactions.length) {
      return { 
        topCategories: [], 
        total: 0 
      };
    }

    const expenses = transactions.filter(t => t.type === 'Expense');
    if (!expenses.length) return { topCategories: [], total: 0 };
    
    const categoryMap = expenses.reduce((acc, transaction) => {
      const category = transaction.categoryName || 'Uncategorized';
      acc[category] = (acc[category] || 0) + (transaction.amount || 0);
      return acc;
    }, {} as Record<string, number>);

    const categories = Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return {
      topCategories: categories.slice(0, 4).map((item, index) => ({
        ...item,
        color: COLORS[index % COLORS.length]
      })),
      total: categories.reduce((sum, item) => sum + item.value, 0)
    };
  }, [transactions]);

  if (!transactions.length || !topCategories.length) {
    return (
      <div className="p-4 bg-white rounded-lg shadow text-center text-gray-500">
        No transaction data available
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 p-4 bg-white rounded-lg shadow">
      <div className="relative w-full max-w-xs h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={topCategories}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              labelLine={false}
            >
              {topCategories.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [
                new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  currencyDisplay: 'code',
                  minimumFractionDigits: 0
                }).format(Number(value)),
                'Amount'
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-sm text-gray-500">Total Expenses</p>
          <p className="text-1xl font-bold">
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              currencyDisplay: 'code',
              minimumFractionDigits: 0
            }).format(total)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topCategories.map((category) => (
          <div key={category.name} className="flex items-center">
            <div 
              className="w-4 h-4 rounded-full mr-2" 
              style={{ backgroundColor: category.color }}
            />
            <div>
              <p className="text-sm font-medium">{category.name}</p>
              <p className="text-xs text-gray-500">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  currencyDisplay: 'code',
                  minimumFractionDigits: 0
                }).format(category.value)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});