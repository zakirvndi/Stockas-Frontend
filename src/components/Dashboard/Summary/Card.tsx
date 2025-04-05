import React from 'react'
import { FaExchangeAlt, FaMoneyBillAlt } from 'react-icons/fa'
import { FaMoneyBillWave } from 'react-icons/fa6'

type CardProps = {
    type: 'income' | 'expense' | 'transaction';
    amount: string;
  };
  
  const Card = ({ type, amount }: CardProps) => {
    const config = {
      income: {
        icon: <FaMoneyBillWave />,
        title: 'Total Income',
        bgColor: 'bg-green-100',
        iconColor: 'text-green-600',
      },
      expense: {
        icon: <FaMoneyBillAlt />,
        title: 'Total Expenses',
        bgColor: 'bg-red-100',
        iconColor: 'text-red-600',
      },
      transaction: {
        icon: <FaExchangeAlt />,
        title: 'Total Transaction',
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-600',
      },
    };
  
    const { icon, title, bgColor, iconColor } = config[type];
  
    return (
      <div className='bg-white p-4 rounded-xl border shadow-sm w-full'>
        <div className='flex items-center gap-4'>
          <span className={`${bgColor} ${iconColor} p-3 text-xl rounded-full`}>
            {icon}
          </span>
          <div>
            <p className='font-medium text-sm md:text-base'>{title}</p>
            <p className='text-lg md:text-xl font-bold'>{amount}</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default Card;