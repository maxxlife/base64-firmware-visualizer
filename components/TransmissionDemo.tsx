import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Server, ArrowRight } from 'lucide-react';

const TransmissionDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'raw' | 'base64'>('raw');

  // Example: ARM NOP instruction (00 00 00 00) followed by legitimate code
  // or a standard ELF header \x7F ELF ...
  const rawBytes = [0x7F, 0x45, 0x4C, 0x46, 0x00, 0x01, 0x01, 0x01]; // .ELF header with nulls
  
  // Simulation Logic
  const rawString = "ELF"; // Representation
  const base64String = "f0VMRgEBAQA="; // Base64 of above
  
  return (
    <div className="bg-embedded-panel border border-slate-700 rounded-lg p-6 mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-embedded-accent" />
            Why use Base64? <span className="text-slate-500 font-normal text-sm ml-2">(Protocol Simulation)</span>
        </h3>
        <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
            <button 
                onClick={() => setActiveTab('raw')}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'raw' ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'text-slate-400 hover:text-white'}`}
            >
                Attempt 1: Raw Binary
            </button>
            <button 
                onClick={() => setActiveTab('base64')}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'base64' ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'text-slate-400 hover:text-white'}`}
            >
                Attempt 2: Base64
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        
        {/* SOURCE */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg relative">
            <div className="text-xs font-bold text-slate-500 mb-2 uppercase">Compiled Firmware (.bin)</div>
            <div className="flex flex-wrap gap-1 font-mono text-sm">
                {rawBytes.map((b, i) => (
                    <span key={i} className={`inline-block px-1 rounded ${b === 0 ? 'bg-red-500/20 text-red-400 font-bold border border-red-500/30' : 'text-slate-300'}`}>
                        {b.toString(16).toUpperCase().padStart(2, '0')}
                    </span>
                ))}
            </div>
            <div className="mt-3 text-[10px] text-slate-500 leading-tight">
                * Note the <span className="text-red-400 font-bold">00</span> byte. In C/C++, this means "End of String".
            </div>
        </div>

        {/* ARROW */}
        <div className="flex flex-col items-center justify-center text-slate-600">
            <div className="text-[10px] uppercase font-bold mb-1">JSON Payload</div>
            <ArrowRight className={`w-8 h-8 ${activeTab === 'raw' ? 'text-red-500 animate-pulse' : 'text-green-500'}`} />
        </div>

        {/* DESTINATION */}
        <div className={`border p-4 rounded-lg relative min-h-[140px] flex flex-col justify-center ${activeTab === 'raw' ? 'bg-red-950/10 border-red-900/50' : 'bg-green-950/10 border-green-900/50'}`}>
            <div className="text-xs font-bold text-slate-500 mb-2 uppercase flex justify-between">
                <span>Server Reception</span>
                {activeTab === 'raw' ? <XCircle className="w-4 h-4 text-red-500"/> : <CheckCircle className="w-4 h-4 text-green-500"/>}
            </div>

            {activeTab === 'raw' ? (
                <>
                    <div className="font-mono text-sm text-slate-400 break-all bg-black/20 p-2 rounded border border-red-900/30">
                        {`{ "fw": "`}<span className="text-white">ELF</span><span className="text-red-500 font-bold bg-red-900/20 px-1">ERROR</span>
                    </div>
                    <div className="mt-3 flex items-start gap-2 text-red-400 text-xs bg-red-900/10 p-2 rounded">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>
                            <strong>Parse Error:</strong> Unexpected control character (0x00) in string literal. Data truncated.
                        </span>
                    </div>
                </>
            ) : (
                <>
                    <div className="font-mono text-sm text-slate-400 break-all bg-black/20 p-2 rounded border border-green-900/30">
                        {`{ "fw": "`}<span className="text-embedded-accent">{base64String}</span>{`" }`}
                    </div>
                    <div className="mt-3 flex items-start gap-2 text-green-400 text-xs bg-green-900/10 p-2 rounded">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        <span>
                            <strong>Success:</strong> Payload valid. Server decodes base64 back to original <code>7F 45 4C...</code> bytes.
                        </span>
                    </div>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default TransmissionDemo;