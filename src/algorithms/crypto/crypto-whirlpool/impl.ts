// Whirlpool · 实现（教学简化：8 轮 16 字节状态）
export interface WhHooks {
  onRound?: (round: number, state: number[]) => void;
  onResult?: (hash: number[]) => void;
}
const SBOX: number[] = Array.from(
  { length: 256 },
  (_, i) => ((i * 0x1b + 0x63) ^ ((i << 3) | (i >>> 5))) & 0xff,
);
export function whirlpool(data: number[], hooks: WhHooks = {}): number[] {
  // padding
  const padded = [...data, 0x80];
  while (padded.length % 32 !== 24) padded.push(0);
  const bits = data.length * 8;
  padded.push(
    (bits >>> 24) & 0xff,
    (bits >>> 16) & 0xff,
    (bits >>> 8) & 0xff,
    bits & 0xff,
    0,
    0,
    0,
    0,
  );
  let H = new Array<number>(32).fill(0);
  for (let blk = 0; blk < padded.length; blk += 32) {
    let state = new Array<number>(32);
    for (let i = 0; i < 32; i++) state[i] = padded[blk + i]! ^ H[i]!;
    for (let r = 0; r < 10; r++) {
      // SubBytes
      state = state.map((b) => SBOX[b]!);
      // Shift（简化：旋转每 4 字节）
      for (let row = 0; row < 8; row++) {
        const off = row * 4;
        const tmp = state.slice(off, off + 4);
        for (let c = 0; c < 4; c++) state[off + c] = tmp[(c + row) % 4]!;
      }
      // MixRows（简化：GF(2^8) 风格异或链）
      for (let row = 0; row < 8; row++) {
        const off = row * 4;
        const t = state[off]!;
        for (let c = 0; c < 3; c++) state[off + c] = state[off + c + 1]!;
        state[off + 3] = t;
      }
      // AddRoundKey（H 作密钥）
      state = state.map((b, i) => b ^ H[i % 32]! ^ (r * 0x11));
      hooks.onRound?.(r, [...state]);
    }
    H = H.map((h, i) => h ^ padded[blk + i]! ^ state[i]!);
  }
  // 取前 32 字节（256 位，简化版）
  const hash = H.slice(0, 32);
  hooks.onResult?.(hash);
  return hash;
}
