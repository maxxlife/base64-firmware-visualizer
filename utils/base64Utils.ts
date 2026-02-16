import { ByteData, ChunkData, Base64Group } from '../types';

const BASE64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

export const stringToBytes = (str: string): ByteData[] => {
  return str.split('').map((char, i) => {
    const code = char.charCodeAt(0);
    return {
      char,
      byteVal: code,
      hex: code.toString(16).toUpperCase().padStart(2, '0'),
      binary: code.toString(2).padStart(8, '0'),
      index: i,
    };
  });
};

export const hexToBytes = (hexStr: string): ByteData[] => {
  // Remove spaces and 0x prefix
  const cleanHex = hexStr.replace(/\s|0x/g, '');
  const bytes: ByteData[] = [];
  
  for (let i = 0; i < cleanHex.length; i += 2) {
    const hexPair = cleanHex.slice(i, i + 2);
    const val = parseInt(hexPair, 16);
    if (!isNaN(val)) {
      bytes.push({
        char: val >= 32 && val <= 126 ? String.fromCharCode(val) : '.',
        byteVal: val,
        hex: hexPair.toUpperCase().padStart(2, '0'),
        binary: val.toString(2).padStart(8, '0'),
        index: i / 2,
      });
    }
  }
  return bytes;
};

export const processChunks = (bytes: ByteData[]): ChunkData[] => {
  const chunks: ChunkData[] = [];
  
  for (let i = 0; i < bytes.length; i += 3) {
    const chunkBytes = bytes.slice(i, i + 3);
    const bitStreamParts = chunkBytes.map(b => b.binary);
    
    // Pad with 0s if we don't have 3 bytes (to reach multiple of 24 bits effectively for processing, though logically handled below)
    let fullBinary = bitStreamParts.join('');
    
    // We need to calculate how many base64 chars this chunk produces
    // 1 byte -> 8 bits -> 2 groups (12 bits needed, 4 padding 0s) -> 2 chars + 2 pad
    // 2 bytes -> 16 bits -> 3 groups (18 bits needed, 2 padding 0s) -> 3 chars + 1 pad
    // 3 bytes -> 24 bits -> 4 groups -> 4 chars
    
    // Pad the binary string to be a multiple of 6 for grouping
    const paddingNeeded = (6 - (fullBinary.length % 6)) % 6;
    const processingBinary = fullBinary + '0'.repeat(paddingNeeded);
    
    const groups: Base64Group[] = [];
    
    for (let j = 0; j < processingBinary.length; j += 6) {
      const segment = processingBinary.slice(j, j + 6);
      const decimal = parseInt(segment, 2);
      groups.push({
        binary: segment,
        decimal,
        char: BASE64_CHARS[decimal],
        isPadding: false,
        originalIndices: [] // Populated purely for viz if needed, simpler to infer
      });
    }

    // Add padding characters '='
    const missingBytes = 3 - chunkBytes.length;
    if (missingBytes === 1) {
       // 2 bytes = 16 bits. 3x6=18. We have 3 chars. 1 Pad.
       groups.push({ binary: '======', decimal: -1, char: '=', isPadding: true, originalIndices: [] });
    } else if (missingBytes === 2) {
       // 1 byte = 8 bits. 2x6=12. We have 2 chars. 2 Pad.
       groups.push({ binary: '======', decimal: -1, char: '=', isPadding: true, originalIndices: [] });
       groups.push({ binary: '======', decimal: -1, char: '=', isPadding: true, originalIndices: [] });
    }

    // Ensure we represent the binary stream as a full 24-bit block for the visualizer, 
    // filling logical "empty" space with placeholders for the UI
    let displayBitStream = fullBinary;
    // Add "phantom" bits for visualization of missing bytes
    if (chunkBytes.length < 3) {
        displayBitStream += '0'.repeat((3 - chunkBytes.length) * 8);
    }

    chunks.push({
      bytes: chunkBytes,
      base64: groups,
      bitStream: displayBitStream
    });
  }
  
  return chunks;
};