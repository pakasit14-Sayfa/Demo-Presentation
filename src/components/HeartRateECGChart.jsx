import { useEffect, useRef } from 'react';

/**
 * HeartRateECGChart - คอมโพเนนต์ Canvas HTML5 ประสิทธิภาพสูงที่จำลอง
 * กราฟเส้นคลื่นไฟฟ้าหัวใจ (ECG/EKG) / อัตราการเต้นของชีพจร แบบเรียลไทม์
 */
export default function HeartRateECGChart({ title = "Heart Rate (BPM)", bpm = 120, color = "#ef4444", icon: Icon }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  // เก็บสถานะแอนิเมชันที่เปลี่ยนแปลงได้ไว้ใน refs เพื่อหลีกเลี่ยงการ re-render ของ React ที่ 60fps
  const stateRef = useRef({
    bpm: bpm,
    currentX: 0,
    currentTime: 0,
    buffer: null,
    width: 0,
    height: 0,
    accX: 0,
  });

  // อัปเดต BPM ใน ref เพื่อให้ลูปแอนิเมชันเห็นค่าล่าสุดเสมอ
  useEffect(() => {
    stateRef.current.bpm = bpm;
  }, [bpm]);

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
      
      // เก็บขนาดการแสดงผลจริง
      const width = rect.width;
      const height = rect.height;
      
      // ตั้งค่าขนาด store ของ canvas ตามอัตราส่วนพิกเซลของอุปกรณ์เพื่อการเรนเดอร์ที่คมชัด
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      
      // ปรับขนาดบริบทกลับเพื่อให้ตรงกับขนาด CSS
      ctx.scale(dpr, dpr);
      
      // อัปเดตขนาดใน state ref ของเรา
      stateRef.current.width = width;
      stateRef.current.height = height;
      
      // เริ่มต้นหรือปรับขนาดของบัฟเฟอร์ ECG
      const newBuffer = new Float32Array(Math.ceil(width));
      if (stateRef.current.buffer) {
        // คัดลอกข้อมูลบัฟเฟอร์เก่ามาถ้าทำได้
        const minLen = Math.min(stateRef.current.buffer.length, newBuffer.length);
        newBuffer.set(stateRef.current.buffer.subarray(0, minLen));
      }
      stateRef.current.buffer = newBuffer;
      
      // หาก currentX อยู่นอกขอบเขตหลังจากการปรับขนาด ให้วนกลับไปเริ่มใหม่
      if (stateRef.current.currentX >= width) {
        stateRef.current.currentX = 0;
      }
    };

    // กำหนดขนาดเริ่มต้นและตั้งค่า resize observer
    resizeCanvas();
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObserver.observe(container);

    // ฟังก์ชันสร้างคลื่น ECG อิงตามเวลาปัจจุบันในจังหวะการเต้นของหัวใจและระยะเวลาของรอบ
    const getECGValue = (tBeat, period) => {
      // จังหวะหัวใจเต้นทำงานใช้เวลาอย่างมาก 0.4 วินาที หรือเต็มรอบถ้าระยะเวลารอบน้อยกว่านั้น
      const activeDuration = Math.min(0.4, period);
      
      if (tBeat < activeDuration) {
        const p = tBeat / activeDuration; // ช่วงระยะ [0, 1]
        
        // การจับคู่ส่วน P-Q-R-S-T
        if (p < 0.08) {
          return 0; // เส้นพื้นฐาน (Baseline)
        } else if (p < 0.18) {
          const pP = (p - 0.08) / 0.10;
          return 0.10 * Math.sin(pP * Math.PI); // คลื่น P (การบีบตัวของหัวใจห้องบน)
        } else if (p < 0.22) {
          return 0; // ระยะ PR
        } else if (p < 0.25) {
          const pQ = (p - 0.22) / 0.03;
          return -0.15 * Math.sin(pQ * Math.PI); // คลื่น Q (ช่วงเริ่มการบีบตัวของหัวใจห้องล่าง)
        } else if (p < 0.30) {
          const pR = (p - 0.25) / 0.05;
          return 1.6 * Math.sin(pR * Math.PI); // คลื่น R (จุดสูงสุดของการบีบตัวของหัวใจห้องล่าง)
        } else if (p < 0.34) {
          const pS = (p - 0.30) / 0.04;
          return -0.35 * Math.sin(pS * Math.PI); // คลื่น S (ช่วงท้ายของการบีบตัวของหัวใจห้องล่าง)
        } else if (p < 0.40) {
          return 0; // ระยะ ST
        } else if (p < 0.60) {
          const pT = (p - 0.40) / 0.20;
          return 0.25 * Math.sin(pT * Math.PI); // คลื่น T (การคลายตัวของหัวใจห้องล่าง)
        } else {
          return 0;
        }
      }
      return 0; // เส้นพื้นฐานเรียบระหว่างการคลายตัวของหัวใจ (diastole)
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

      // คำนวณเวลาที่ผ่านไปในหน่วยวินาที
      const dt = (now - lastTime) / 2500;
      lastTime = now;

      // ความเร็วของการวิ่งเส้นคลื่น EKG เป็นพิกเซลต่อวินาที
      const sweepSpeed = 90; // พิกเซลต่อวินาที
      
      // คำนวณจำนวนพิกเซลที่เราต้องเดินหน้าในเฟรมนี้
      const dx = dt * sweepSpeed;
      state.accX += dx;

      // ระยะเวลาของรอบปัจจุบันอิงจาก BPM 
      const currentBpm = state.bpm || 120;
      const beatPeriod = 60 / currentBpm;

      // ประมวลผลทุกพิกเซลที่เราเดินหน้าไปเพื่อสร้างจุด ECG ใหม่
      const pixelsToDraw = Math.floor(state.accX);
      if (pixelsToDraw > 0) {
        state.accX -= pixelsToDraw;
        
        for (let i = 0; i < pixelsToDraw; i++) {
          // สเตปเวลาเทียบเท่ากับหนึ่งพิกเซล
          state.currentTime += 1 / sweepSpeed;
          const tBeat = state.currentTime % beatPeriod;
          
          // คำนวณความสูงของคลื่น ECG ดิบ
          let ecgVal = getECGValue(tBeat, beatPeriod);
          
          // เพิ่มคลื่นรบกวนแบบสุ่มเล็กน้อยให้ดูเป็นธรรมชาติ
          const noise = (Math.random() - 0.5) * 0.03;
          ecgVal += noise;
          
          // เขียนข้อมูลลงในบัฟเฟอร์พิกเซลแบบวงกลม
          const writeIdx = Math.floor(state.currentX);
          buffer[writeIdx] = ecgVal;
          
          // เลื่อนอินเด็กซ์และวนกลับมาใหม่ถ้าเกิน
          state.currentX = (state.currentX + 1) % width;
        }
      }

      // เรนเดอร์กราฟ EKG
      ctx.clearRect(0, 0, width, height);

      // 1. วาดพื้นหลังตาราง
      ctx.strokeStyle = '#222831';
      ctx.lineWidth = 0.5;
      
      const gridSpacing = 20;
      
      // เส้นแนวตั้ง
      for (let x = 0; x < width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      // เส้นแนวนอน
      for (let y = 0; y < height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. เรนเดอร์เส้นพาร์ทคลื่นพัลส์ ECG
      const baselineY = height * 0.60; // จัดเส้นพื้นฐานไว้ที่ความสูง 60% ของจอ
      const amplitudeScale = height * 0.22; // ปรับสเกลแอมพลิจูดให้พอดีกับความสูง
      
      const gapSize = 25; // จำนวนพิกเซลว่างนำหน้าแท่งกราฟกวาด
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
          // ตรวจสอบว่าพิกเซลตกอยู่ในช่องว่างกวาด (gap) หรือไม่
          const inGap = gapStart < gapEnd
            ? (x >= gapStart && x <= gapEnd)
            : (x >= gapStart || x <= gapEnd);

          if (inGap) {
            // เริ่มต้น subpath ใหม่หลังจากเลยช่องว่าง
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

      // วาดเส้นแบบสองชั้น: ชั้นกว้างแบบโปร่งแสงเพื่อเรืองแสง และชั้นบางแกนในที่สว่าง
      drawWaveform('rgba(239, 68, 68, 0.25)', 4.5);
      drawWaveform(color, 2);

      // 3. วาดจุดหัวของคลื่นในส่วนหน้าสุดของเส้นกราฟ
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
        ctx.shadowBlur = 0; // รีเซ็ตเงา
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    // เริ่มลูปแอนิเมชัน
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
          Real-time EKG
        </span>
      </div>
      <div ref={containerRef} className="flex-1 w-full relative overflow-hidden bg-[#111319]/30 rounded-lg border border-[#2d333b]/50">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      </div>
    </div>
  );
}
