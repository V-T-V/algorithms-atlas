export interface PhHooks {
  onByte?: (i: number, h: number) => void;
}
const T = Array.from({ length: 256 }, (_, i) => (i * 73 + 11) & 0xff);
export function pearsonHash(data: number[], hooks: PhHooks = {}): number {
  let h = 0;
  for (let i = 0; i < data.length; i++) {
    h = T[(h ^ data[i]!) & 0xff]!;
    hooks.onByte?.(i, h);
  }
  return h & 0xff;
}
