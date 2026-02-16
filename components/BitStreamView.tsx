import React from 'react';
import { ChunkData } from '../types';

interface BitStreamViewProps {
  chunk: ChunkData;
  chunkIndex: number;
}

const BitStreamView: React.FC<BitStreamViewProps> = ({ chunk, chunkIndex }) => {
  // Define colors for the 3 input bytes
  const byteColors = [
    'text-blue-400 border-blue-400 bg-blue-400/10',
    'text-purple-400 border-purple-400 bg-purple-400/10',
    'text-pink-400 border-pink-400 bg-pink-400/10'
  ];

  const byteTextColors = [
    'text-blue-400',
    'text-purple-400',
    'text-pink-400'
  ];

  return (
    <div className="flex flex-col gap-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700 min-w-[700px]">
      
      {/* HEADER: MEMORY ADDRESS SIMULATION */}
      <div className="flex items-center text-xs font-mono text-slate-500 mb-2">
        <span className="mr-4">OFFSET: 0x{((chunkIndex * 3)).toString(16).toUpperCase().padStart(4, '0')}</span>
      </div>

      {/* LAYER 1: INPUT BYTES (Raw Data) */}
      <div className="grid grid-cols-[100px_1fr] items-center">
        <div className="text-xs font-bold text-slate-400">INPUT (8-bit)</div>
        <div className="flex gap-2 font-mono">
          {Array.from({ length: 3 }).map((_, i) => {
            const byte = chunk.bytes[i];
            return (
              <div 
                key={`byte-${i}`} 
                className={`relative w-[216px] h-20 flex flex-col items-center justify-center border-2 rounded-md transition-all ${byte ? byteColors[i] : 'border-slate-800 bg-slate-800/20 text-slate-700'}`}
              >
                {byte ? (
                  <>
                    <span className="text-2xl font-bold mb-1">{byte.char}</span>
                    <div className="flex flex-col items-center text-xs opacity-80">
                      <span>DEC: {byte.byteVal}</span>
                      <span>HEX: 0x{byte.hex}</span>
                    </div>
                  </>
                ) : (
                  <span className="text-xs">EMPTY</span>
                )}
                {/* 8-bit labels */}
                <div className="absolute -bottom-6 flex w-full justify-between px-1 text-[10px] text-slate-500">
                  <span>7</span><span>0</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CONNECTION LINES (Visual connector) */}
      <div className="h-8 relative w-full -my-2">
         {/* This area connects the 8-bit boxes to the continuous bit stream below */}
         <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[660px] h-[1px] bg-slate-700"></div>
         </div>
      </div>

      {/* LAYER 2: CONTINUOUS BIT STREAM */}
      <div className="grid grid-cols-[100px_1fr] items-center">
        <div className="text-xs font-bold text-slate-400">BIT STREAM</div>
        <div className="flex font-mono text-lg tracking-[0.22em] relative">
             {/* Render all 24 bits */}
             {chunk.bitStream.split('').map((bit, idx) => {
                 // Determine which byte color this bit belongs to
                 const byteIndex = Math.floor(idx / 8);
                 const isRealData = byteIndex < chunk.bytes.length;
                 const colorClass = isRealData ? byteTextColors[byteIndex] : 'text-slate-700';
                 
                 return (
                     <span key={idx} className={`${colorClass} w-[27px] text-center inline-block`}>
                         {bit}
                     </span>
                 );
             })}
        </div>
      </div>

      {/* LAYER 3: 6-BIT GROUPING INDICATORS */}
      <div className="grid grid-cols-[100px_1fr] items-center -mt-4">
        <div className="text-xs font-bold text-slate-400">GROUPS (6-bit)</div>
        <div className="flex relative pl-[2px]"> 
            {/* Brackets to group 6 bits */}
            {chunk.base64.map((group, idx) => (
                <div key={idx} className="w-[162px] flex flex-col items-center">
                    {/* Bracket SVG */}
                    <div className="w-full h-4 border-b-2 border-x-2 border-slate-500 rounded-b-lg mb-1"></div>
                    {/* 6-bit Value */}
                    <div className={`text-xs font-mono ${group.isPadding ? 'text-slate-600' : 'text-embedded-highlight'}`}>
                        {group.binary}
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* LAYER 4: BASE64 OUTPUT */}
      <div className="grid grid-cols-[100px_1fr] items-center mt-2">
        <div className="text-xs font-bold text-slate-400">OUTPUT</div>
        <div className="flex gap-2 font-mono">
            {chunk.base64.map((group, idx) => (
                <div 
                  key={idx} 
                  className={`w-[158px] h-20 flex flex-col items-center justify-center border rounded-md ${group.isPadding ? 'border-slate-700 bg-slate-800/30 text-slate-500' : 'border-embedded-highlight/50 bg-embedded-highlight/10 text-embedded-highlight'}`}
                >
                    <span className="text-3xl font-bold">{group.char}</span>
                    {!group.isPadding && (
                        <span className="text-xs mt-1">Index: {group.decimal}</span>
                    )}
                    {group.isPadding && (
                        <span className="text-xs mt-1 italic">PAD</span>
                    )}
                </div>
            ))}
        </div>
      </div>

    </div>
  );
};

export default BitStreamView;