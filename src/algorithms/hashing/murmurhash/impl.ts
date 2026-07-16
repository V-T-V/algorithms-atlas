// =============================================================================
// MurmurHash3 (32-bit) · 纯算法实现
// Austin Appleby 的 multiply-rotate-xor 非加密哈希。
// 零 DOM 依赖，可独立单测。通过「钩子」暴露每一步。
// =============================================================================

/** MurmurHash3 32-bit 常量。 */
const C1 = 0xcc9e2d51;
const C2 = 0x1b873593;

/** 事件钩子。 */
export interface MurmurHooks {
  /** 处理完一个 4 字节块（k1 中间值，hash 为混入后的累计值）。 */
  onBlock?: (blockIndex: number, k1: number, hash: number) => void;
  /** 处理尾部字节（tailBytes, tailValue）。 */
  onTail?: (tailBytes: number, tailValue: number, hash: number) => void;
  /** 终结混合后输出最终 32 位值。 */
  onResult?: (hash: number) => void;
}

/** 32 位左旋转。 */
function rotl32(x: number, r: number): number {
  return (((x >>> 0) << r) | (x >>> (32 - r))) >>> 0;
}

/** fmix32 终结混合。 */
export function fmix32(h: number): number {
  let x = h >>> 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x85ebca6b);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  x ^= x >>> 16;
  return x >>> 0;
}

/** 把输入归一化为字节数组（小端序读取 4 字节块）。 */
function toBytes(data: string | number[]): number[] {
  if (typeof data === 'string') {
    return Array.from(new TextEncoder().encode(data));
  }
  return data;
}

/**
 * MurmurHash3 x86 32-bit。
 *
 * @param data 输入（字符串按 UTF-8 取字节）
 * @param seed 种子（默认 0）
 * @param hooks 可选事件钩子
 * @returns 32 位无符号哈希值
 */
export function murmurhash3(
  data: string | number[],
  seed: number = 0,
  hooks: MurmurHooks = {},
): number {
  const bytes = toBytes(data);
  const nblocks = Math.floor(bytes.length / 4);
  let h = seed >>> 0;

  // —— body：每 4 字节一块 ——
  for (let i = 0; i < nblocks; i++) {
    const base = i * 4;
    // 小端读取 4 字节为 k1
    let k1 =
      (bytes[base]! & 0xff) |
      ((bytes[base + 1]! & 0xff) << 8) |
      ((bytes[base + 2]! & 0xff) << 16) |
      ((bytes[base + 3]! & 0xff) << 24);
    k1 = Math.imul(k1, C1);
    k1 = rotl32(k1, 15);
    k1 = Math.imul(k1, C2);
    h ^= k1;
    h = rotl32(h, 13);
    h = (Math.imul(h, 5) + 0xe6546b64) >>> 0;
    hooks.onBlock?.(i, k1, h);
  }

  // —— tail：剩余 1~3 字节 ——
  const tailBase = nblocks * 4;
  let k1 = 0;
  const tailBytes = bytes.length & 3; // 等于 bytes.length - tailBase
  if (tailBytes > 0) {
    if (tailBytes >= 3) k1 ^= (bytes[tailBase + 2]! & 0xff) << 16;
    if (tailBytes >= 2) k1 ^= (bytes[tailBase + 1]! & 0xff) << 8;
    k1 ^= bytes[tailBase]! & 0xff;
    k1 = Math.imul(k1, C1);
    k1 = rotl32(k1, 15);
    k1 = Math.imul(k1, C2);
    h ^= k1;
    hooks.onTail?.(tailBytes, k1, h);
  }

  // —— finalization ——
  h ^= bytes.length;
  h = fmix32(h);
  hooks.onResult?.(h);
  return h >>> 0;
}

/** 批量哈希。 */
export function murmurhash3Batch(inputs: Array<string | number[]>, seed: number = 0): number[] {
  return inputs.map((d) => murmurhash3(d, seed));
}
