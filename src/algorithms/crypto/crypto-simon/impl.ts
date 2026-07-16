export interface SmHooks {
  onRound?: (round: number, l: number, r: number) => void;
}
function rotl(x: number, s: number): number {
  s &= 0x1f;
  return ((x << s) | (x >>> (32 - s))) & 0xffffffff;
}
export function simonEncrypt(key: number[], block: number[], hooks: SmHooks = {}): number[] {
  let L = (block[0]! << 24) | (block[1]! << 16) | (block[2]! << 8) | block[3]!;
  let R = (block[4]! << 24) | (block[5]! << 16) | (block[6]! << 8) | block[7]!;
  let k = (key[0]! << 24) | (key[1]! << 16) | (key[2]! << 8) | key[3]!;
  for (let i = 0; i < 32; i++) {
    const t = L;
    L = (R ^ (rotl(L, 1) & rotl(L, 8)) ^ rotl(L, 2) ^ k) >>> 0;
    R = t;
    k = (rotl(k, 3) ^ i) >>> 0;
    hooks.onRound?.(i, L, R);
  }
  return [
    (L >>> 24) & 0xff,
    (L >>> 16) & 0xff,
    (L >>> 8) & 0xff,
    L & 0xff,
    (R >>> 24) & 0xff,
    (R >>> 16) & 0xff,
    (R >>> 8) & 0xff,
    R & 0xff,
  ];
}
