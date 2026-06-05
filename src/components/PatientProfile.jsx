import React from 'react';

export default function PatientProfile() {
  return (
    <div className="bg-[#1c2128] rounded-xl p-5 flex flex-col justify-between h-full text-gray-300">
      {/* Top Profile */}
      <div className="flex gap-4 items-center">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#2d333b]">
          {/* We'll use a placeholder cat image since we don't have the exact one */}
          <img src="src/img/Cat.jpg" alt="Luna" className="w-full h-full object-cover" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Luna <span className="text-pink-400 text-lg">♀</span>
          </h2>
          <p className="text-sm mt-1">Cat | Domestic Shorthair</p>
          <p className="text-sm">Age: 2Y 3M | Weight: 3.45 kg</p>
        </div>
      </div>

      {/* Middle Details */}
      <div className="flex flex-col gap-2 mt-6 text-sm">
        <p><span className="font-bold text-white">Box / Bed ID:</span> RBX-07</p>
        <p><span className="font-bold text-white">Procedure:</span> Spay</p>
        <p><span className="font-bold text-white">Attending Vet:</span> Dr. ธนกฤต ศรีสุวรรณ</p>
      </div>

      {/* Bottom Status */}
      <div className="mt-6">
        <p className="text-green-500 font-bold text-base flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
          Stable
        </p>
        <p className="text-green-500/80 text-xs mt-0.5">All vitals normal</p>
      </div>
    </div>
  );
}
