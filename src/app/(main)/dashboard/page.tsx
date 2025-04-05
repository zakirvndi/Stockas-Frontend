import Summary from '@/components/Dashboard/Summary/Summary'
import React from 'react'


const page = () => {
  return (
    <div className="flex-1 flex flex-col gap-6 p-4 md:p-6">
      <h1 className='text-2xl font-bold'>Dashboard</h1>
      <Summary />
    </div>
  );
};
export default page