import React, { useState, useEffect } from 'react';

export default function Header() {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format like "May 24, 2025 | 10:24:36 AM"
      const dateOpts = { month: 'short', day: 'numeric', year: 'numeric' };
      const timeOpts = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
      const dateStr = now.toLocaleDateString('en-US', dateOpts);
      const tStr = now.toLocaleTimeString('en-US', timeOpts);
      setTimeStr(`${dateStr} | ${tStr}`);
    };
    updateTime();
    const t = setInterval(updateTime, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="flex justify-between items-center py-4 px-6 text-white bg-[#111319]">
      <h1 className="text-xl font-bold tracking-wide">
        
      </h1>
      <div className="text-sm font-medium text-gray-300">
        {timeStr}
      </div>
    </header>
  );
}
