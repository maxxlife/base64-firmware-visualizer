import React from 'react';

const EmbeddedExplanation: React.FC = () => {
  const cCode = `// Embedded C Implementation Example
#include <stdint.h>
#include <stdlib.h>

static const char table[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

void base64_encode(const uint8_t *src, size_t len, char *out) {
    uint8_t *p = (uint8_t *)src;
    size_t i = 0;
    
    // Process 3 bytes at a time (24 bits -> 4 chars)
    while (i < len - 2) {
        *out++ = table[(p[i] >> 2) & 0x3F]; // Top 6 bits of byte 0
        *out++ = table[((p[i] & 0x03) << 4) | ((p[i+1] >> 4) & 0x0F)]; // Bottom 2 of byte 0 + Top 4 of byte 1
        *out++ = table[((p[i+1] & 0x0F) << 2) | ((p[i+2] >> 6) & 0x03)]; // Bottom 4 of byte 1 + Top 2 of byte 2
        *out++ = table[p[i+2] & 0x3F]; // Bottom 6 bits of byte 2
        
        p += 3;
        i += 3;
    }
    
    // Handle padding (remaining 1 or 2 bytes)...
    if (i < len) {
        *out++ = table[(p[0] >> 2) & 0x3F];
        if (len - i == 1) {
            *out++ = table[(p[0] & 0x03) << 4];
            *out++ = '=';
        } else { // len - i == 2
            *out++ = table[((p[0] & 0x03) << 4) | ((p[1] >> 4) & 0x0F)];
            *out++ = table[(p[1] & 0x0F) << 2];
        }
        *out++ = '=';
    }
    *out = '\\0';
}`;

  return (
    <div className="bg-embedded-panel border border-slate-700 rounded-lg p-6 mt-8">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-embedded-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        Firmware Implementation
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
              <p className="text-slate-300 mb-4 leading-relaxed">
                  In embedded systems, Base64 is crucial for transmitting binary data (like images, firmware updates, or sensor logs) over text-safe protocols like JSON, XML, or UART commands.
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 mb-6">
                  <li><strong className="text-embedded-accent">Bitwise Operations:</strong> Unlike high-level languages with built-in libraries, firmware often uses shift (`&gt;&gt;`, `&lt;&lt;`) and mask (`&`) operations for efficiency.</li>
                  <li><strong className="text-embedded-accent">Lookup Table:</strong> The `table[]` array maps the 6-bit index (0-63) to the ASCII character directly in flash memory.</li>
                  <li><strong className="text-embedded-accent">Buffer Management:</strong> Encoding increases size by ~33%. A 1024-byte buffer needs ~1366 bytes for the Base64 string.</li>
              </ul>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <pre className="relative bg-black p-4 rounded-lg overflow-x-auto text-xs font-mono text-green-400 border border-slate-800 shadow-xl">
                {cCode}
            </pre>
          </div>
      </div>
    </div>
  );
};

export default EmbeddedExplanation;