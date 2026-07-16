// =============================================================================
// Rail Fence 栅栏密码 · 纯算法实现
// =============================================================================

export interface RailFenceHooks {
  onPlace?: (i: number, ch: string, rail: number) => void;
  onReadRail?: (rail: number, content: string) => void;
}

export interface RailFenceResult {
  text: string;
  /** 每条 rail 上的字符（按顺序）。 */
  rails: string[][];
}

/** 计算第 i 个字符落在哪条 rail 上（0-based，Z 字形往返）。 */
function railOf(i: number, rails: number): number {
  if (rails <= 1) return 0;
  const cycle = 2 * (rails - 1);
  const pos = i % cycle;
  return pos < rails ? pos : cycle - pos;
}

/**
 * 栅栏密码加密：把明文按 Z 字形分到 rails 条栏，再逐栏拼接。
 */
export function railFenceEncrypt(
  text: string,
  rails: number,
  hooks: RailFenceHooks = {},
): RailFenceResult {
  if (!Number.isInteger(rails) || rails < 1) {
    throw new RangeError(`rails 必须 >= 1，收到 ${rails}`);
  }
  const buckets: string[][] = [];
  for (let r = 0; r < rails; r++) buckets.push([]);
  const chars = Array.from(text);
  for (let i = 0; i < chars.length; i++) {
    const r = railOf(i, rails);
    buckets[r]!.push(chars[i]!);
    hooks.onPlace?.(i, chars[i]!, r);
  }
  let out = '';
  for (let r = 0; r < buckets.length; r++) {
    const s = buckets[r]!.join('');
    out += s;
    hooks.onReadRail?.(r, s);
  }
  return { text: out, rails: buckets };
}

/** 栅栏密码解密：已知 rails 与密文长度，反推每个明文位置对应的密文偏移。 */
export function railFenceDecrypt(ciphertext: string, rails: number): string {
  if (!Number.isInteger(rails) || rails < 1) {
    throw new RangeError(`rails 必须 >= 1，收到 ${rails}`);
  }
  const n = ciphertext.length;
  if (n === 0) return '';
  // 算每条 rail 上有多少字符
  const counts: number[] = new Array(rails).fill(0);
  for (let i = 0; i < n; i++) counts[railOf(i, rails)]!++;
  // 切分密文到各 rail
  const buckets: string[] = [];
  let idx = 0;
  for (let r = 0; r < rails; r++) {
    const c = counts[r]!;
    buckets.push(ciphertext.slice(idx, idx + c));
    idx += c;
  }
  // 按明文顺序重组
  const pointers: number[] = new Array(rails).fill(0);
  let out = '';
  for (let i = 0; i < n; i++) {
    const r = railOf(i, rails);
    out += buckets[r]![pointers[r]!]!;
    pointers[r]!++;
  }
  return out;
}
