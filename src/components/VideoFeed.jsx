import React from 'react';

export default function VideoFeed() {
  return (
    <div className="bg-[#1c2128] rounded-xl overflow-hidden relative h-full flex flex-col justify-center">
      {/* "LIVE" Badge */}
      <div className="absolute top-3 left-3 bg-[#111319]/80 backdrop-blur-sm text-[#3b82f6] text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1.5 z-10 border border-[#3b82f6]/30">
        <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] animate-pulse" />
        LIVE
      </div>

      {/* Video element - placeholder cat video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
        src="src/img/CatMmv.mp4"
      />
    </div>
  );
}
