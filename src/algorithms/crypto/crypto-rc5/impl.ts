// RC5 · 实现（w=16, r=4 简化版）
export interface Rc5Hooks {
  onRound?: (round: number, a: number, b: number) => void;
}
function rotl16(x: number, n: number): number {
  n &= 15;
  return ((x << n) | (x >>> (16 - n))) & 0xffff;
}
export function rc5KeyExpand(key: number[], r: number): number[] {
  // 简化魔数常量（w=16）
  const P = 0xb7e1;
  const Q = 0x9e37;
  const L: number[] = [];
  for (let i = 0; i < key.length; i += 2) L.push(((key[i] ?? 0) << 8) | (key[i + 1] ?? 0));
  if (L.length === 0) L.push(0);
  const S: number[] = [P];
  for (let i = 1; i < 2 * (r + 1); i++) S.push((S[i - 1]! + Q) & 0xffff);
  let i = 0;
  let j = 0;
  let A = 0;
  let B = 0;
  const n = Math.max(8, 3 * Math.max(S.length, L.length));
  for (let k = 0; k < n; k++) {
    S[i] = rotl16((S[i]! + A + B) & 0xffff, 3);
    A = S[i]!;
    L[j] = rotl16((L[j]! + A + B) & 0xffff, (A + B) & 15);
    B = L[j]!;
    i = (i + 1) % S.length;
    j = (j + 1) % L.length;
  }
  return S;
}
export function rc5Encrypt(
  key: number[],
  block: number[],
  r: number = 4,
  hooks: Rc5Hooks = {},
): number[] {
  const S = rc5KeyExpand(key, r);
  let A = (block[0]! << 8) | block[1]!;
  let B = (block[2]! << 8) | block[3]!;
  A = (A + S[0]!) & 0xffff;
  B = (B + S[1]!) & 0xffff;
  for (let i = 1; i <= r; i++) {
    A = (rotl16(A ^ B, B) + S[2 * i]!) & 0xffff;
    B = (rotl16(B ^ A, A) + S[2 * i + 1]!) & 0xffff;
    hooks.onRound?.(i, A, B);
  }
  return [(A >>> 8) & 0xff, A & 0xff, (B >>> 8) & 0xff, B & 0xff];
}
