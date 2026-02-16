export interface ByteData {
  char: string;
  byteVal: number;
  hex: string;
  binary: string; // 8 bits
  index: number;
}

export interface Base64Group {
  binary: string; // 6 bits
  decimal: number;
  char: string;
  isPadding: boolean;
  originalIndices: number[]; // Indices of bytes contributing to this group
}

export interface ChunkData {
  bytes: ByteData[];
  base64: Base64Group[];
  bitStream: string; // 24 bits (padded with 0 if needed)
}