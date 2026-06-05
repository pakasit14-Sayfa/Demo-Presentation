import React from 'react';
import catImg from '../img/Cat.jpg';
import dogImg from '../img/Dog.jpg';

export default function PatientProfile({ patientType = 'cat', onTogglePatient }) {
  const isDog = patientType === 'dog';
  
  return (
    <div className="bg-[#1c2128] rounded-xl p-5 flex flex-col justify-between h-full text-gray-300">
      {/* Top Profile */}
      <div className="flex gap-4 items-center">
        <div 
          className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#2d333b] cursor-pointer hover:border-blue-400 transition-colors"
          onClick={onTogglePatient}
          title="Click to switch patient"
        >
          {isDog ? (
            <img src={dogImg} alt="Max" className="w-full h-full object-cover" />
          ) : (
            <img src={catImg} alt="Luna" className="w-full h-full object-cover" />
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            {isDog ? 'Max' : 'Luna'} <span className={isDog ? "text-blue-400 text-lg" : "text-pink-400 text-lg"}>{isDog ? '♂' : '♀'}</span>
          </h2>
          <p className="text-sm mt-1">{isDog ? 'Dog | Golden Retriever' : 'Cat | Domestic Shorthair'}</p>
          <p className="text-sm">Age: {isDog ? '4Y 2M' : '2Y 3M'} | Weight: {isDog ? '28.5 kg' : '3.45 kg'}</p>
        </div>
      </div>

      {/* Middle Details */}
      <div className="flex flex-col gap-2 mt-6 text-sm">
        <p><span className="font-bold text-white">Box / Bed ID:</span> {isDog ? 'RBX-12' : 'RBX-07'}</p>
        <p><span className="font-bold text-white">Procedure:</span> {isDog ? 'Dental Cleaning' : 'Spay'}</p>
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
