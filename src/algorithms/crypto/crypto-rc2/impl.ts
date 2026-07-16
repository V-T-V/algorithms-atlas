export interface Rc2Hooks {
  onRound?: (round: number, w0: number, w1: number) => void;
}
const PITABLE = Array.from({ length: 256 }, (_, i) => (i * 0x11 + 7) & 0xff);
function rotl(x: number, s: number): number {
  s &= 0x1f;
  return ((x << s) | (x >>> (32 - s))) & 0xffffffff;
}
export function rc2Encrypt(key: number[], block: number[], hooks: Rc2Hooks = {}): number[] {
  const K = key.map((v, i) => PITABLE[(v ?? 0) ^ PITABLE[i % PITABLE.length]!]!);
  let w0 = (block[0]! << 8) | block[1]!;
  let w1 = (block[2]! << 8) | block[3]!;
  for (let r = 0; r < 16; r++) {
    w0 = (w0 + w1 + (K[r % K.length] ?? 0)) & 0xffff;
    w0 = rotl(w0, r + 1) & 0xffff;
    w1 = (w1 + w0) & 0xffff;
    w1 = rotl(w1, r + 2) & 0xffff;
    hooks.onRound?.(r, w0, w1);
  }
  return [(w0 >> 8) & 0xff, w0 & 0xff, (w1 >> 8) & 0xff, w1 & 0xff];
}
