import { useEffect, useRef } from 'react';

/**
 * RespiratoryWaveformChart - คอมโพเนนต์ Canvas HTML5 ประสิทธิภาพสูงที่จำลอง
 * กราฟคลื่นการหายใจ (Respiratory Waveform / Capnogram) แบบเรียลไทม์
 */
export default function RespiratoryWaveformChart({ title = "Respiratory Rate", respiratory = 20, color = "#3b82f6", icon: Icon }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  // เก็บสถานะแอนิเมชันที่เปลี่ยนแปลงได้ไว้ใน refs เพื่อหลีกเลี่ยงการ re-render ของ React ที่ 60fps
  const stateRef = useRef({
    respiratory: respiratory,
    currentX: 0,
    currentTime: 0,
    buffer: null,
    width: 0,
    height: 0,
    accX: 0,
  });

  // อัปเดตค่าการหายใจใน ref
  useEffect(() => {
    stateRef.current.respiratory = respiratory;
  }, [respiratory]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let lastTime = performance.now();

    // จัดการการปรับขนาด canvas ให้ตรงกับขนาดของ container
    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      const width = rect.width;
      const height = rect.height;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      
      ctx.scale(dpr, dpr);
      
      stateRef.current.width = width;
      stateRef.current.height = height;
      
      const newBuffer = new Float32Array(Math.ceil(width));
      if (stateRef.current.buffer) {
        const minLen = Math.min(stateRef.current.buffer.length, newBuffer.length);
        newBuffer.set(stateRef.current.buffer.subarray(0, minLen));
      }
      stateRef.current.buffer = newBuffer;
      
      if (stateRef.current.currentX >= width) {
        stateRef.current.currentX = 0;
      }
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObserver.observe(container);

    // ฟังก์ชันสร้างคลื่นการหายใจ (เน้นความนุ่มนวล)
    const getRespiratoryValue = (tBeat, period) => {
      // period คือระยะเวลาต่อ 1 การหายใจ (วินาที)
      const p = tBeat / period; // ช่วงระยะ [0, 1] ใน 1 รอบ
      
      // คลื่นการหายใจจะมีลักษณะคล้าย sine wave แต่การหายใจเข้า (ขึ้น) อาจจะสั้นกว่าการหายใจออก (ลง) เล็กน้อย
      // สมมติ: หายใจเข้า 40% ของรอบ, หายใจออก 40% ของรอบ, พัก 20%
      if (p < 0.4) {
        // หายใจเข้า (Inspiration) - โค้งขึ้น
        const pIn = p / 0.4;
        return Math.sin(pIn * Math.PI / 2); 
      } else if (p < 0.8) {
        // หายใจออก (Expiration) - โค้งลง
        const pOut = (p - 0.4) / 0.4;
        return Math.cos(pOut * Math.PI / 2);
      } else {
        // พัก (Pause) - เส้นตรงใกล้ 0
        return 0;
      }
    };

    // ลูปหลักของแอนิเมชัน
    const tick = (now) => {
      const state = stateRef.current;
      const buffer = state.buffer;
      const width = state.width;
      const height = state.height;

      if (!buffer || width <= 0 || height <= 0) {
        animationFrameId = requestAnimationFrame(tick);
        return;
      }

      const dt = (now - lastTime) / 1000;
      lastTime = now;

      // ความเร็วของการวิ่งเส้นคลื่นหายใจ (จะช้ากว่า EKG มาก)
      const sweepSpeed = 40; // พิกเซลต่อวินาที
      
      const dx = dt * sweepSpeed;
      state.accX += dx;

      // ระยะเวลาของรอบปัจจุบันอิงจากค่าการหายใจต่อนาที
      const currentResp = state.respiratory || 20;
      const breathPeriod = 60 / currentResp;

      const pixelsToDraw = Math.floor(state.accX);
      if (pixelsToDraw > 0) {
        state.accX -= pixelsToDraw;
        
        for (let i = 0; i < pixelsToDraw; i++) {
          state.currentTime += 1 / sweepSpeed;
          const tBeat = state.currentTime % breathPeriod;
          
          let respVal = getRespiratoryValue(tBeat, breathPeriod);
          
          // คลื่นรบกวนน้อยมากสำหรับคลื่นหายใจ
          const noise = (Math.random() - 0.5) * 0.01;
          respVal += noise;
          
          const writeIdx = Math.floor(state.currentX);
          buffer[writeIdx] = respVal;
          
          state.currentX = (state.currentX + 1) % width;
        }
      }

      // เรนเดอร์กราฟ
      ctx.clearRect(0, 0, width, height);

      // 1. วาดพื้นหลังตาราง
      ctx.strokeStyle = '#222831';
      ctx.lineWidth = 0.5;
      
      const gridSpacing = 20;
      
      for (let x = 0; x < width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      for (let y = 0; y < height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. เรนเดอร์เส้นพาร์ทคลื่นหายใจ
      const baselineY = height * 0.75; // ฐานอยู่ต่ำหน่อยเพราะคลื่นพุ่งขึ้น
      const amplitudeScale = height * 0.4; // ความสูงคลื่น
      
      const gapSize = 15;
      const gapStart = Math.floor(state.currentX);
      const gapEnd = (gapStart + gapSize) % width;

      const drawWaveform = (strokeColor, lineWidth) => {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        
        let started = false;
        
        for (let x = 0; x < width; x++) {
          const inGap = gapStart < gapEnd
            ? (x >= gapStart && x <= gapEnd)
            : (x >= gapStart || x <= gapEnd);

          if (inGap) {
            started = false;
            continue;
          }

          const val = buffer[x];
          const yPixel = baselineY - val * amplitudeScale;

          if (!started) {
            ctx.moveTo(x, yPixel);
            started = true;
          } else {
            ctx.lineTo(x, yPixel);
          }
        }
        ctx.stroke();
      };

      // เส้นเรืองแสง
      drawWaveform('rgba(59, 130, 246, 0.25)', 4.5);
      // เส้นหลักแกนใน
      drawWaveform(color, 2);

      // 3. วาดจุดหัวของคลื่น
      const headX = Math.floor(state.currentX);
      if (headX < width && buffer[headX] !== undefined) {
        const headVal = buffer[headX];
        const headY = baselineY - headVal * amplitudeScale;
        
        ctx.beginPath();
        ctx.arc(headX, headY, 3, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [color]);

  return (
    <div className="bg-[#1c2128] rounded-xl p-4 flex flex-col h-[280px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
          {Icon && <Icon className="w-4 h-4 text-gray-400" />}
          {title}
        </h3>
        <span className="text-[10px] text-gray-400 font-bold bg-[#111319] px-2 py-0.5 rounded border border-[#2d333b] uppercase tracking-wider">
          Real-time Waveform
        </span>
      </div>
      <div ref={containerRef} className="flex-1 w-full relative overflow-hidden bg-[#111319]/30 rounded-lg border border-[#2d333b]/50">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      </div>
    </div>
  );
}
