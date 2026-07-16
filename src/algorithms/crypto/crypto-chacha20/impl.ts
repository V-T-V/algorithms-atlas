// =============================================================================
// ChaCha20 · 纯算法实现（核心 20 轮块函数，教学版）
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

/** ChaCha quarter-round：a,b,c,d。 */
function qround(x: number[], ai: number, bi: number, ci: number, di: number): void {
  x[ai] = add32(x[ai]!, x[bi]!);
  x[di] = u32(x[di]! ^ x[ai]!);
  x[di] = rotl32(x[di]!, 16);
  x[ci] = add32(x[ci]!, x[di]!);
  x[bi] = u32(x[bi]! ^ x[ci]!);
  x[bi] = rotl32(x[bi]!, 12);
  x[ai] = add32(x[ai]!, x[bi]!);
  x[di] = u32(x[di]! ^ x[ai]!);
  x[di] = rotl32(x[di]!, 8);
  x[ci] = add32(x[ci]!, x[di]!);
  x[bi] = u32(x[bi]! ^ x[ci]!);
  x[bi] = rotl32(x[bi]!, 7);
}

export interface ChaCha20Hooks {
  onRound?: (round: number, state: number[]) => void;
  onConclude?: (state: number[]) => void;
}

function doubleRound(x: number[]): void {
  // 列轮
  qround(x, 0, 4, 8, 12);
  qround(x, 1, 5, 9, 13);
  qround(x, 2, 6, 10, 14);
  qround(x, 3, 7, 11, 15);
  // 行轮
  qround(x, 0, 5, 10, 15);
  qround(x, 1, 6, 11, 12);
  qround(x, 2, 7, 8, 13);
  qround(x, 3, 4, 9, 14);
}

/** ChaCha20 核心块：输入 16 个 32 位字，输出加回原状态的 16 个字。 */
export function chacha20Core(input: readonly number[], hooks: ChaCha20Hooks = {}): number[] {
  const x = [...input];
  for (let i = 0; i < ROUNDS / 2; i++) {
    doubleRound(x);
    if (i < 2 || i >= ROUNDS / 2 - 1) hooks.onRound?.(i, [...x]);
  }
  const out = x.map((v, i) => add32(v, input[i]!));
  hooks.onConclude?.(out);
  return out;
}

/** 小端序列化 16 个 32 位字为 64 字节。 */
export function chacha20Serialize(words: readonly number[]): Uint8Array {
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
