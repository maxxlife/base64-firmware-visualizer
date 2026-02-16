import React from 'react';

const LookupTable: React.FC = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split('');

  return (
    <div className="bg-embedded-panel border border-slate-700 rounded-lg p-6 mt-8">
       <h3 className="text-xl font-bold text-white mb-4">Base64 Index Table</h3>
       <div className="h-64 overflow-y-auto pr-2 custom-scrollbar">
         <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-16 gap-2">
            {chars.map((char, idx) => (
                <div key={idx} className="flex flex-col items-center p-2 rounded bg-slate-800 border border-slate-700 hover:border-embedded-accent transition-colors">
                    <span className="text-xs text-slate-500">{idx}</span>
                    <span className="font-mono font-bold text-embedded-accent">{char}</span>
                    <span className="text-[10px] text-slate-600 font-mono mt-1">{idx.toString(2).padStart(6, '0')}</span>
                </div>
            ))}
         </div>
       </div>
    </div>
  );
};

export default LookupTable;