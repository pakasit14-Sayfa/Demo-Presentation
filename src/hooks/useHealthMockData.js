import { useState, useEffect, useRef } from 'react';

function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }
function walk(prev, dMin, dMax, min, max) {
  return clamp(prev + Math.random() * (dMax - dMin) + dMin, min, max);
}

/**
 * useHealthMockData — veterinary recovery box telemetry simulation.
 *
 * Vitals (update every 1 s):
 *   bpm           90–150
 *   respiratory   18–40 br/min
 *   bodyTemp      99.5–103.0 °F  (animal core temp)
 *   weight        3.20–18.50 kg (±0.05)
 *   hrChange      -8 … +8 bpm/min
 *
 * Chart data:
 *   graphData        last 30 ticks  { time, bpm, respiratory }
 *   hrChangeHistory  last 12 ticks  { time, change }
 */
export function useHealthMockData() {
  const [bpm, setBpm]               = useState(112);
  const [respiratory, setResp]      = useState(26);
  const [bodyTemp, setBodyTemp]     = useState(101.5);
  const [weight, setWeight]         = useState(3.4);
  const [hrChange, setHrChange]     = useState(0);
  const [graphData, setGraphData]   = useState(
    Array(15).fill(null).map(() => ({ time: '', bpm: 112, respiratory: 26 }))
  );
  
  const [weightGraphData, setWeightGraphData] = useState(() => {
    const data = [];
    const now = new Date();
    // Generate last 7 hours of data
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 60 * 60 * 1000);
      const t = [
        d.getHours().toString().padStart(2, '0'),
        '00'
      ].join(':');
      const mockW = 3.35 + (Math.random() * 0.1 - 0.05);
      data.push({ time: t, weight: parseFloat(mockW.toFixed(2)) });
    }
    return data;
  });
  const [hrChangeHistory, setHrChangeHistory] = useState(
    Array(12).fill(null).map((_, i) => ({
      label: `${12 - i}s`,
      change: Math.round((Math.random() * 10 - 5)),
    }))
  );

  const prevBpm = useRef(112);

  useEffect(() => {
    const tick = setInterval(() => {
      setBpm(prev => {
        // Increased the delta to make the graph more jagged/spiky
        const next = Math.round(walk(prev, -6, 8, 90, 150));
        const delta = clamp(next - prevBpm.current, -12, 12);
        setHrChange(delta);
        prevBpm.current = next;

        // push to hrChangeHistory
        setHrChangeHistory(h => {
          const now = new Date();
          return [
            ...h.slice(1),
            { label: `${now.getSeconds()}s`, change: delta },
          ];
        });

        return next;
      });

      // Increased delta for respiratory to add more jaggedness
      setResp(prev => Math.round(walk(prev, -4, 4, 18, 40)));

      setBodyTemp(prev => {
        const next = walk(prev, -0.2, 0.2, 99.5, 103.0);
        return parseFloat(next.toFixed(1));
      });

      setWeight(prev => {
        const next = walk(prev, -0.05, 0.05, 3.2, 18.5);
        return parseFloat(next.toFixed(2));
      });
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  // Graph data
  useEffect(() => {
    setGraphData(prev => {
      const now = new Date();
      const t = [
        now.getHours().toString().padStart(2, '0'),
        now.getMinutes().toString().padStart(2, '0'),
        now.getSeconds().toString().padStart(2, '0'),
      ].join(':');
      return [...prev.slice(1), { time: t, bpm, respiratory }];
    });
  }, [bpm, respiratory]);

  // Hourly weight history
  useEffect(() => {
    const hourlyTick = setInterval(() => {
      setWeightGraphData(prev => {
        const now = new Date();
        const t = [
          now.getHours().toString().padStart(2, '0'),
          now.getMinutes().toString().padStart(2, '0')
        ].join(':');
        return [...prev.slice(1), { time: t, weight }];
      });
    }, 60 * 60 * 1000); // 1 hour
    return () => clearInterval(hourlyTick);
  }, [weight]);

  return {
    bpm, respiratory, bodyTemp, weight, hrChange,
    graphData, hrChangeHistory, weightGraphData
  };
}
