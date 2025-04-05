import React from 'react'
import Card from './Card'

const Summary = () => {
    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        <Card 
          type="income" 
          amount="IDR 320,000,000" 
        />
        <Card 
          type="expense" 
          amount="IDR 27,870,000" 
        />
        <Card 
          type="transaction" 
          amount="12.368" 
        />
      </div>
    );
  };
  
  export default Summary;