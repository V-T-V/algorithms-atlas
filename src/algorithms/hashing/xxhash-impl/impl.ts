// =============================================================================
// xxHash (XXH32) · 纯算法实现
// Yann Collet 的极快非加密哈希。零 DOM 依赖，可独立单测。
// 通过「钩子」暴露每个 stripe / 尾部字节 / 雪崩的关键步骤。
// =============================================================================

/** XXH32 魔素。 */
const PRIME32_1 = 0x9e3779b1;
const PRIME32_2 = 0x85ebca77;
const PRIME32_3 = 0xc2b2ae3d;
const PRIME32_4 = 0x27d4eb2f;
const PRIME32_5 = 0x165667b1;

/** 事件钩子。 */
export interface XxHashHooks {
  /** 处理完一个 16 字节 stripe 后四个累加器的当前值。 */
  onStripe?: (stripeIndex: number, acc: [number, number, number, number]) => void;
  /** 处理尾部一段（4/2/1 字节）后累加值。 */
  onTail?: (tailBytes: number, acc: number) => void;
  /** 雪崩结束，输出最终 32 位值。 */
  onResult?: (hash: number) => void;
}

/** 32 位左旋转。 */
function rotl32(x: number, r: number): number {
  return (((x >>> 0) << r) | (x >>> (32 - r))) >>> 0;
}

/** 把输入归一化为字节数组。 */
function toBytes(data: string | number[]): number[] {
  if (typeof data === 'string') {
    return Array.from(new TextEncoder().encode(data));
  }
  return data;
}

/** 小端读取 4 字节为无符号 32 位。 */
function read32LE(bytes: number[], off: number): number {
  return (
    ((bytes[off]! & 0xff) |
      ((bytes[off + 1]! & 0xff) << 8) |
      ((bytes[off + 2]! & 0xff) << 16) |
      ((bytes[off + 3]! & 0xff) << 24)) >>>
    0
  );
}

/** 单个 lane 的 round：acc = rotl32(acc + lane*P2, 17) * P1。 */
function round32(acc: number, lane: number): number {
  const sum = (acc + Math.imul(lane, PRIME32_2)) >>> 0;
  return Math.imul(rotl32(sum, 17), PRIME32_1) >>> 0;
}

/** 雪崩（final mix）。 */
export function avalanche(h: number): number {
  let x = h >>> 0;
  x ^= x >>> 15;
  x = Math.imul(x, PRIME32_2);
  x ^= x >>> 13;
  x = Math.imul(x, PRIME32_3);
  x ^= x >>> 16;
  return x >>> 0;
}

/**
 * XXH32 算法。
 *
 * @param data 输入（字符串按 UTF-8 取字节）
 * @param seed 种子（默认 0）
 * @param hooks 可选事件钩子
 * @returns 32 位无符号哈希值
 */
export function xxh32(data: string | number[], seed: number = 0, hooks: XxHashHooks = {}): number {
  const bytes = toBytes(data);
  let acc: number;

  if (bytes.length >= 16) {
    const acc1 = (seed + PRIME32_1 + PRIME32_2) >>> 0;
    const acc2 = (seed + PRIME32_2) >>> 0;
    const acc3 = seed >>> 0;
    const acc4 = (seed - PRIME32_1) >>> 0;
    const a: [number, number, number, number] = [acc1, acc2, acc3, acc4];

    const nstripes = Math.floor(bytes.length / 16);
    for (let s = 0; s < nstripes; s++) {
      const base = s * 16;
      a[0] = round32(a[0]!, read32LE(bytes, base));
      a[1] = round32(a[1]!, read32LE(bytes, base + 4));
      a[2] = round32(a[2]!, read32LE(bytes, base + 8));
      a[3] = round32(a[3]!, read32LE(bytes, base + 12));
      hooks.onStripe?.(s, [a[0]!, a[1]!, a[2]!, a[3]!]);
    }

    acc = (rotl32(a[0]!, 1) + rotl32(a[1]!, 7) + rotl32(a[2]!, 12) + rotl32(a[3]!, 18)) >>> 0;
  } else {
    acc = (seed + PRIME32_5) >>> 0;
  }

  acc = (acc + bytes.length) >>> 0;

  // —— 尾部：每次消费 4 字节 ——
  let off = bytes.length - (bytes.length % 16);
  while (off + 4 <= bytes.length) {
    const lane = read32LE(bytes, off);
    acc = (acc + Math.imul(lane, PRIME32_3)) >>> 0;
    acc = Math.imul(rotl32(acc, 17), PRIME32_4) >>> 0;
    hooks.onTail?.(4, acc);
    off += 4;
  }
  // —— 剩余单字节（每次消费 1 字节） ——
  while (off < bytes.length) {
    const lane = bytes[off]! & 0xff;
    acc = (acc + Math.imul(lane, PRIME32_5)) >>> 0;
    acc = Math.imul(rotl32(acc, 11), PRIME32_1) >>> 0;
    hooks.onTail?.(1, acc);
    off += 1;
  }

  const hash = avalanche(acc);
  hooks.onResult?.(hash);
  return hash >>> 0;
}

/** 批量哈希。 */
export function xxh32Batch(inputs: Array<string | number[]>, seed: number = 0): number[] {
  return inputs.map((d) => xxh32(d, seed));
}
