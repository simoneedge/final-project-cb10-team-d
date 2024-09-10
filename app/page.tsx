import Card from '@/src/components/Card';
import ScrollToTopButton from '@/src/components/ScrollToTopButton';
import React from 'react';


const HomePage = () => {
  return (
    <div className="flex flex-col justify-between items-center min-h-screen bg-gray-100 relative">
      <main className="flex flex-col items-center justify-center flex-grow space-y-4">
        <Card backgroundColor="#4E614E" />

        <Card backgroundColor="#F2B85A" />

        <Card backgroundColor="#822225" />
      </main>

      <ScrollToTopButton />
    </div>
  );
};

export default HomePage;