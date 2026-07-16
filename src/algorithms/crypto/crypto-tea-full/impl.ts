// TEA 完整版 · 实现（标准 32 轮）
export interface TeaHooks {
  onRound?: (round: number, v0: number, v1: number) => void;
}
const DELTA = 0x9e3779b9;
export function teaEncrypt(key: number[], block: number[], hooks: TeaHooks = {}): number[] {
  const K = [
    ((key[0] ?? 0) << 24) | ((key[1] ?? 0) << 16) | ((key[2] ?? 0) << 8) | (key[3] ?? 0),
    ((key[4] ?? 0) << 24) | ((key[5] ?? 0) << 16) | ((key[6] ?? 0) << 8) | (key[7] ?? 0),
    ((key[8] ?? 0) << 24) | ((key[9] ?? 0) << 16) | ((key[10] ?? 0) << 8) | (key[11] ?? 0),
    ((key[12] ?? 0) << 24) | ((key[13] ?? 0) << 16) | ((key[14] ?? 0) << 8) | (key[15] ?? 0),
  ];
  let v0 = (block[0]! << 24) | (block[1]! << 16) | (block[2]! << 8) | block[3]!;
  let v1 = (block[4]! << 24) | (block[5]! << 16) | (block[6]! << 8) | block[7]!;
  let sum = 0;
  for (let i = 0; i < 32; i++) {
    sum = (sum + DELTA) >>> 0;
    v0 = (v0 + (((v1 << 4) + K[0]!) ^ (v1 + sum) ^ ((v1 >>> 5) + K[1]!))) >>> 0;
    v1 = (v1 + (((v0 << 4) + K[2]!) ^ (v0 + sum) ^ ((v0 >>> 5) + K[3]!))) >>> 0;
    hooks.onRound?.(i, v0, v1);
  }
  return [
    (v0 >>> 24) & 0xff,
    (v0 >>> 16) & 0xff,
    (v0 >>> 8) & 0xff,
    v0 & 0xff,
    (v1 >>> 24) & 0xff,
    (v1 >>> 16) & 0xff,
    (v1 >>> 8) & 0xff,
    v1 & 0xff,
  ];
}
export function teaDecrypt(key: number[], block: number[], hooks: TeaHooks = {}): number[] {
  const K = [
    ((key[0] ?? 0) << 24) | ((key[1] ?? 0) << 16) | ((key[2] ?? 0) << 8) | (key[3] ?? 0),
    ((key[4] ?? 0) << 24) | ((key[5] ?? 0) << 16) | ((key[6] ?? 0) << 8) | (key[7] ?? 0),
    ((key[8] ?? 0) << 24) | ((key[9] ?? 0) << 16) | ((key[10] ?? 0) << 8) | (key[11] ?? 0),
    ((key[12] ?? 0) << 24) | ((key[13] ?? 0) << 16) | ((key[14] ?? 0) << 8) | (key[15] ?? 0),
  ];
  let v0 = (block[0]! << 24) | (block[1]! << 16) | (block[2]! << 8) | block[3]!;
  let v1 = (block[4]! << 24) | (block[5]! << 16) | (block[6]! << 8) | block[7]!;
  let sum = (DELTA * 32) >>> 0;
  for (let i = 0; i < 32; i++) {
    v1 = (v1 - (((v0 << 4) + K[2]!) ^ (v0 + sum) ^ ((v0 >>> 5) + K[3]!))) >>> 0;
    v0 = (v0 - (((v1 << 4) + K[0]!) ^ (v1 + sum) ^ ((v1 >>> 5) + K[1]!))) >>> 0;
    sum = (sum - DELTA) >>> 0;
    hooks.onRound?.(i, v0, v1);
  }
  return [
    (v0 >>> 24) & 0xff,
    (v0 >>> 16) & 0xff,
    (v0 >>> 8) & 0xff,
    v0 & 0xff,
    (v1 >>> 24) & 0xff,
    (v1 >>> 16) & 0xff,
    (v1 >>> 8) & 0xff,
    v1 & 0xff,
  ];
}
