export interface PrHooks {
  onRound?: (round: number, state: number) => void;
}
const SBOX = [0xc, 0x5, 0x6, 0xb, 0x9, 0x0, 0xa, 0xd, 0x3, 0xe, 0xf, 0x8, 0x4, 0x7, 0x1, 0x2];
export function presentEncrypt(key: number[], block: number[], hooks: PrHooks = {}): number[] {
  let state = (block[0]! << 24) | (block[1]! << 16) | (block[2]! << 8) | block[3]!;
  let rk = (key[0]! << 24) | (key[1]! << 16) | (key[2]! << 8) | key[3]!;
  for (let r = 0; r < 16; r++) {
    state ^= rk;
    let s = 0;
    for (let i = 0; i < 8; i++) s |= SBOX[(state >>> (i * 4)) & 0xf]! << (i * 4);
    state = s >>> 0;
    rk = ((rk << 1) | (rk >>> 31)) & 0xffffffff;
    hooks.onRound?.(r, state);
  }
  return [(state >>> 24) & 0xff, (state >>> 16) & 0xff, (state >>> 8) & 0xff, state & 0xff];
}
