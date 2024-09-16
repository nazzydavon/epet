import React, { useState, useEffect } from 'react';

interface CoinDropProps {
  isActive: boolean;
}

const CoinDrop: React.FC<CoinDropProps> = ({ isActive }) => {
  const [coins, setCoins] = useState<{ id: number; x: number; y: number; speed: number }[]>([]);

  useEffect(() => {
    if (isActive) {
      const newCoins = Array.from({ length: 5 }, (_, index) => ({
        id: Date.now() + index,
        x: Math.random() * 100,
        y: -20,
        speed: 0.5 + Math.random() * 0.5,
      }));
      setCoins(prevCoins => [...prevCoins, ...newCoins]);

      // Remove coins after animation
      const timer = setTimeout(() => {
        setCoins([]);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isActive]);

  return (
    <div className="coin-drop">
      {coins.map(coin => (
        <div
          key={coin.id}
          className="coin neon-coin"
          style={{
            left: `${coin.x}%`,
            top: `${coin.y}%`,
          }}
        />
      ))}
    </div>
  );
};

export default CoinDrop;