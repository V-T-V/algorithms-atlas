// =============================================================================
// Salsa20 · 纯算法实现（核心 20 轮块函数，教学版）
// 仅实现 Salsa20 核心块函数：输入 16 个 32 位字，输出 64 字节密钥流。
// =============================================================================
const ROUNDS = 20;

function u32(x: number): number {
  return x >>> 0;
}
function add32(a: number, b: number): number {
  return u32((a >>> 0) + (b >>> 0));
}
function rotl32(x: number, c: number): number {
  return u32((x << c) | (x >>> (32 - c)));
}
/** QR：Salsa20 quarter-round。 */
function qround(a: number, b: number, c: number, d: number): [number, number, number, number] {
  b ^= rotl32(add32(a, d), 7);
  c ^= rotl32(add32(b, a), 9);
  d ^= rotl32(add32(c, b), 13);
  a ^= rotl32(add32(d, c), 18);
  return [a, b, c, d];
}

export interface Salsa20Hooks {
  onRound?: (round: number, state: number[]) => void;
  onConclude?: (state: number[]) => void;
}

/** 对 16 字状态做双轮（列轮+行轮）。 */
function doubleRound(x: number[]): void {
  // 列轮
  const [a0, b0, c0, d0] = qround(x[0]!, x[4]!, x[8]!, x[12]!);
  x[0] = a0;
  x[4] = b0;
  x[8] = c0;
  x[12] = d0;
  const [a1, b1, c1, d1] = qround(x[5]!, x[9]!, x[13]!, x[1]!);
  x[5] = a1;
  x[9] = b1;
  x[13] = c1;
  x[1] = d1;
  const [a2, b2, c2, d2] = qround(x[10]!, x[14]!, x[2]!, x[6]!);
  x[10] = a2;
  x[14] = b2;
  x[2] = c2;
  x[6] = d2;
  const [a3, b3, c3, d3] = qround(x[15]!, x[3]!, x[7]!, x[11]!);
  x[15] = a3;
  x[3] = b3;
  x[7] = c3;
  x[11] = d3;
  // 行轮
  const [e0, f0, g0, h0] = qround(x[0]!, x[1]!, x[2]!, x[3]!);
  x[0] = e0;
  x[1] = f0;
  x[2] = g0;
  x[3] = h0;
  const [e1, f1, g1, h1] = qround(x[5]!, x[6]!, x[7]!, x[4]!);
  x[5] = e1;
  x[6] = f1;
  x[7] = g1;
  x[4] = h1;
  const [e2, f2, g2, h2] = qround(x[10]!, x[11]!, x[8]!, x[9]!);
  x[10] = e2;
  x[11] = f2;
  x[8] = g2;
  x[9] = h2;
  const [e3, f3, g3, h3] = qround(x[15]!, x[12]!, x[13]!, x[14]!);
  x[15] = e3;
  x[12] = f3;
  x[13] = g3;
  x[14] = h3;
}

/**
 * Salsa20 核心块函数：输入 16 个 32 位字，输出 16 个字（加回原状态）。
 * 这就是 Salsa20 的核心；实际密钥流还需设置常数/计数器。
 */
export function salsa20Core(input: readonly number[], hooks: Salsa20Hooks = {}): number[] {
  const x = [...input];
  for (let i = 0; i < ROUNDS / 2; i++) {
    doubleRound(x);
    if (i < 2 || i >= ROUNDS / 2 - 1) hooks.onRound?.(i, [...x]);
  }
  // 加回原状态
  const out = x.map((v, i) => add32(v, input[i]!));
  hooks.onConclude?.(out);
  return out;
}

/** 把 16 个 32 位字序列化为 64 字节（小端）。 */
export function salsa20Serialize(words: readonly number[]): Uint8Array {
  const out = new Uint8Array(words.length * 4);
  for (let i = 0; i < words.length; i++) {
    const w = words[i]! >>> 0;
    out[i * 4] = w & 0xff;
    out[i * 4 + 1] = (w >>> 8) & 0xff;
    out[i * 4 + 2] = (w >>> 16) & 0xff;
    out[i * 4 + 3] = (w >>> 24) & 0xff;
  }
  return out;
}
