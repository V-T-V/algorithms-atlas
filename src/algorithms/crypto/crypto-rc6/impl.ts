// RC6 · 实现（w=16, r=4 简化版）
export interface Rc6Hooks {
  onRound?: (round: number, a: number, b: number, c: number, d: number) => void;
}
function rotl16(x: number, n: number): number {
  n &= 15;
  return ((x << n) | (x >>> (16 - n))) & 0xffff;
}
function mul16(x: number, y: number): number {
  return (x * y) & 0xffff;
}
export function rc6Encrypt(
  key: number[],
  block: number[],
  r: number = 4,
  hooks: Rc6Hooks = {},
): number[] {
  const P = 0xb7e1;
  const Q = 0x9e37;
  const S: number[] = [P];
  for (let i = 1; i < 2 * r + 4; i++) S.push((S[i - 1]! + Q) & 0xffff);
  let A = (block[0]! << 8) | block[1]!;
  let B = (block[2]! << 8) | block[3]!;
  let C = (block[4]! << 8) | block[5]!;
  let D = (block[6]! << 8) | block[7]!;
  void key;
  B = (B + S[0]!) & 0xffff;
  D = (D + S[1]!) & 0xffff;
  for (let i = 1; i <= r; i++) {
    const t = rotl16(mul16(B, 2 * B + 1), 4) & 0xffff;
    const u = rotl16(mul16(D, 2 * D + 1), 4) & 0xffff;
    A = rotl16(A ^ t, u) & 0xffff;
    C = rotl16(C ^ u, t) & 0xffff;
    [A, B, C, D] = [B, C, D, A];
    hooks.onRound?.(i, A, B, C, D);
  }
  B = (B + S[2 * r + 2]!) & 0xffff;
  D = (D + S[2 * r + 3]!) & 0xffff;
  return [
    (A >>> 8) & 0xff,
    A & 0xff,
    (B >>> 8) & 0xff,
    B & 0xff,
    (C >>> 8) & 0xff,
    C & 0xff,
    (D >>> 8) & 0xff,
    D & 0xff,
  ];
}
