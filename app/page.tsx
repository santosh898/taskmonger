// app/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const handleKeyPress = () => {
      setShowSplash(false);
      router.push('/onboarding/gettingstarted');
    };

    window.addEventListener('keypress', handleKeyPress);

    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [router]);

  const handleClick = () => {
    setShowSplash(false);
    router.push('/onboarding/gettingstarted');
  };

  if (showSplash) {
    return (
      <div
        className="flex items-center justify-center h-screen bg-gray-900"
        onClick={handleClick}
      >
        <h1 className="text-white text-2xl animate-blink">
          Press any key to enter
        </h1>
        <style jsx>{`
          @keyframes blink {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0;
            }
          }
          .animate-blink {
            animation: blink 1s infinite;
          }
        `}</style>
      </div>
    );
  }

  return null; // Or you can return some initial content if needed
}
