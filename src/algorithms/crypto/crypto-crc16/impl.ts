export interface Crc16Hooks {
  onByte?: (i: number, crc: number) => void;
}
const POLY = 0xa001;
export function crc16(data: number[], hooks: Crc16Hooks = {}): number {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i]!;
    for (let b = 0; b < 8; b++) {
      crc = crc & 1 ? ((crc >>> 1) ^ POLY) & 0xffff : crc >>> 1;
    }
    hooks.onByte?.(i, crc);
  }
  return crc & 0xffff;
}
