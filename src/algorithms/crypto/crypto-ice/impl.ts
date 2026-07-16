export interface IceHooks {
  onRound?: (round: number, l: number, r: number) => void;
}
export function iceEncrypt(key: number[], block: number[], hooks: IceHooks = {}): number[] {
  let L = (block[0]! << 24) | (block[1]! << 16) | (block[2]! << 8) | block[3]!;
  let R = (block[4]! << 24) | (block[5]! << 16) | (block[6]! << 8) | block[7]!;
  const K = (key[0]! << 24) | (key[1]! << 16) | (key[2]! << 8) | key[3]!;
  for (let i = 0; i < 16; i++) {
    const newR = (L ^ (((R ^ (K + i)) * 0x010101 + 0x63) & 0xffffffff)) >>> 0;
    L = R;
    R = newR;
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
