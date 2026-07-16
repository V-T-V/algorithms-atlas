export interface Crc32Hooks {
  onByte?: (i: number, crc: number) => void;
}
const POLY = 0xedb88320;
export function crc32(data: number[], hooks: Crc32Hooks = {}): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i]!;
    for (let b = 0; b < 8; b++) crc = crc & 1 ? ((crc >>> 1) ^ POLY) >>> 0 : crc >>> 1;
    hooks.onByte?.(i, crc);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
