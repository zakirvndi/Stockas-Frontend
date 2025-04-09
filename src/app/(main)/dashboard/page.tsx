'use client';

import { useEffect } from 'react';
import useSWR from 'swr';
import { TransactionType } from '../../types/transaction';
import { getTransactions } from '../../services/transactionService';
import Summary from '@/components/Dashboard/Summary/Summary';
import CategoryChart from '@/components/Dashboard/Statistics/CategoryChart';

const fetcher = async (): Promise<TransactionType[]> => {
  const { items } = await getTransactions(1, 1000);
  return items;
};

export default function DashboardPage() {
  const { data: transactions = [], error, isLoading } = useSWR<TransactionType[]>(
    'transactions', 
    fetcher,
    {
      revalidateOnFocus: true,
      refreshInterval: 30000,
    }
  );

  useEffect(() => {
    if (transactions.length > 0) {
      console.log('Valid transactions data:', transactions);
    }
  }, [transactions]);

  if (isLoading) {
    return <div className="text-center p-8 text-gray-500">Loading transactions...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">
      Error loading transactions: {error.message}
    </div>;
  }

  return (
    <div className="flex-1 flex flex-col gap-6 p-4 md:p-6">
      <h1 className='text-2xl font-bold'>Dashboard</h1>
      <Summary transactions={transactions} />
      <div className="grid grid-cols-1 gap-6">
        <CategoryChart transactions={transactions} />
      </div>
    </div>
  );
}