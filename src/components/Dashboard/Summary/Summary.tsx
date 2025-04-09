'use client';

import React from 'react';
import Card from './Card';
import { TransactionType } from '@/app/types/transaction';

interface SummaryProps {
  transactions?: TransactionType[];
}

const Summary = ({ transactions }: SummaryProps) => {
  // Memoize the safe transactions array
  const safeTransactions = React.useMemo(() => {
    return Array.isArray(transactions) ? transactions : [];
  }, [transactions]);

  // Calculate totals safely
  const totals = React.useMemo(() => {
    return safeTransactions.reduce((acc, transaction) => {
      if (transaction?.type === 'Income') {
        acc.income += transaction.amount || 0;
      } else if (transaction?.type === 'Expense') {
        acc.expense += transaction.amount || 0;
      }
      return acc;
    }, { income: 0, expense: 0 });
  }, [safeTransactions]);

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
      <Card 
        type="income" 
        amount={new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0
        }).format(totals.income)}
      />
      <Card 
        type="expense" 
        amount={new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0
        }).format(totals.expense)}
      />
      <Card 
        type="transaction" 
        amount={safeTransactions.length.toString()}
      />
    </div>
  );
};

export default Summary;