import React, { useEffect, useState } from 'react';
import './CelebrationAnimation.css';

const CelebrationAnimation: React.FC = () => {
  const [particles, setParticles] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const colors = ['#FFD700', '#FFA500', '#FF4500', '#8A2BE2', '#00CED1'];
    const newParticles = [];

    for (let i = 0; i < 50; i++) {
      const style = {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        transform: `scale(${Math.random()})`,
        animation: `fall ${1 + Math.random() * 2}s linear`,
      };

      newParticles.push(<div key={i} className="particle" style={style} />);
    }

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="celebration-container">
      {particles}
    </div>
  );
};

export default CelebrationAnimation;