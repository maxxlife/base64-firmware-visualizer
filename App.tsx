import React, { useState, useEffect } from 'react';
import { stringToBytes, hexToBytes, processChunks } from './utils/base64Utils';
import { ChunkData } from './types';
import BitStreamView from './components/BitStreamView';
import EmbeddedExplanation from './components/EmbeddedExplanation';
import TransmissionDemo from './components/TransmissionDemo';
import LookupTable from './components/LookupTable';
import { Cpu, Terminal, Binary, FileCode, Trash2 } from 'lucide-react';

const App: React.FC = () => {
  const [inputType, setInputType] = useState<'text' | 'hex'>('text');
  const [inputValue, setInputValue] = useState('Firmware');
  const [chunks, setChunks] = useState<ChunkData[]>([]);

  useEffect(() => {
    let bytes;
    if (inputType === 'text') {
      bytes = stringToBytes(inputValue);
    } else {
      bytes = hexToBytes(inputValue);
    }
    setChunks(processChunks(bytes));
  }, [inputValue, inputType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const clearInput = () => setInputValue('');

  // Sample inputs
  const loadSample = (type: 'text' | 'hex', val: string) => {
    setInputType(type);
    setInputValue(val);
  };

  return (
    <div className="min-h-screen bg-embedded-bg text-slate-200 font-sans selection:bg-embedded-accent selection:text-black pb-20">
      
      {/* NAVBAR */}
      <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-embedded-accent/10 rounded-lg">
                <Cpu className="w-6 h-6 text-embedded-accent" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">Base64<span className="text-embedded-accent">Viz</span></span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-400">
               <span className="hidden sm:inline">Embedded Controller Firmware Utility</span>
               <a href="#" className="hover:text-white transition-colors"><Binary className="w-5 h-5"/></a>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* HEADER SECTION */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Binary to Base64 Encoder</h1>
          <p className="text-slate-400 max-w-2xl">
            Visualize how raw bytes are split, regrouped, and mapped to Base64 characters. 
            Essential for understanding data encoding in UART, I2C logs, or firmware update packets.
          </p>
        </div>

        {/* INPUT CONTROLS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* CONTROL PANEL */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-embedded-panel p-1 rounded-lg flex border border-slate-700">
              <button 
                onClick={() => setInputType('text')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${inputType === 'text' ? 'bg-embedded-accent text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                ASCII String
              </button>
              <button 
                onClick={() => setInputType('hex')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${inputType === 'hex' ? 'bg-embedded-accent text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                Hex Bytes
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                 <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Input Data</label>
                 <button onClick={clearInput} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors">
                    <Trash2 className="w-3 h-3"/> Clear
                 </button>
              </div>
              <textarea
                value={inputValue}
                onChange={handleInputChange}
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 rounded-md p-3 text-white font-mono focus:ring-2 focus:ring-embedded-accent focus:border-transparent outline-none transition-all placeholder-slate-600 resize-none"
                placeholder={inputType === 'text' ? "Enter text..." : "e.g. 4D 61 6E"}
              />
            </div>
            
            <div>
               <label className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2 block">Quick Examples</label>
               <div className="flex flex-wrap gap-2">
                  <button onClick={() => loadSample('text', 'Man')} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-xs font-mono transition-colors">"Man"</button>
                  <button onClick={() => loadSample('text', 'Firmware')} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-xs font-mono transition-colors">"Firmware"</button>
                  <button onClick={() => loadSample('hex', 'DE AD BE EF')} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-xs font-mono transition-colors">0xDEADBEEF</button>
                  <button onClick={() => loadSample('hex', '00 01 02')} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-xs font-mono transition-colors">00 01 02</button>
               </div>
            </div>
          </div>

          {/* RESULT SUMMARY */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-lg p-6 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Terminal className="w-32 h-32" />
            </div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Encoded Output</h3>
            <div className="font-mono text-3xl break-all text-embedded-accent leading-relaxed">
               {chunks.flatMap(c => c.base64).map(b => b.char).join('') || <span className="text-slate-600 italic text-xl">Waiting for input...</span>}
            </div>
            <div className="mt-6 flex items-center gap-4 text-xs text-slate-500 font-mono">
               <span>Input Bytes: {inputType === 'text' ? inputValue.length : inputValue.replace(/\s|0x/g, '').length / 2}</span>
               <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
               <span>Output Chars: {chunks.length * 4}</span>
               <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
               <span>Efficiency: ~75%</span>
            </div>
          </div>
        </div>

        {/* DEMO: WHY BASE64 */}
        <TransmissionDemo />

        {/* VISUALIZATION STREAM */}
        <div className="space-y-4 mt-8">
           <div className="flex items-center gap-2 mb-4">
              <FileCode className="w-5 h-5 text-embedded-highlight" />
              <h2 className="text-xl font-bold text-white">Bitwise Visualization</h2>
           </div>
           
           <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
             <div className="flex gap-8 w-max px-1">
               {chunks.length === 0 && (
                   <div className="text-slate-500 py-12 px-4 border border-dashed border-slate-700 rounded-lg w-full text-center">
                       Start typing above to see the bit stream generated...
                   </div>
               )}
               {chunks.map((chunk, idx) => (
                 <BitStreamView key={idx} chunk={chunk} chunkIndex={idx} />
               ))}
             </div>
           </div>
           <p className="text-xs text-slate-500 italic mt-2 text-center sm:text-left">* Scroll horizontally to view full stream</p>
        </div>

        {/* EXPLANATION & TABLE */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-4">
             <EmbeddedExplanation />
             <LookupTable />
        </div>

      </main>
    </div>
  );
};

export default App;