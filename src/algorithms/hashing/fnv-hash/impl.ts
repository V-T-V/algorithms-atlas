// =============================================================================
// FNV-1a 哈希（Fowler–Noll–Vo 1a, 32-bit）· 纯算法实现
// 逐字节：hash = (hash XOR byte) * FNV_prime，最后取低 32 位（无符号）。
// 零 DOM 依赖，可独立单测。通过「钩子」暴露每字节的中间哈希值。
// =============================================================================

/** FNV-1a 32-bit 常量。 */
export const FNV_OFFSET_BASIS_32 = 0x811c9dc5; // 2166136261
export const FNV_PRIME_32 = 0x01000193; // 16777619

/** 算法执行过程中的事件钩子。任一可选。 */
export interface FnvHashHooks {
  /** 处理完一个字节（octetIndex 从 0 开始，hash 为处理该字节后的中间值）。 */
  onOctet?: (octetIndex: number, byte: number, hash: number) => void;
  /** 处理完所有字节，输出最终 32 位哈希。 */
  onResult?: (hash: number) => void;
}

/** 把输入归一化为字节数组。 */
function toBytes(data: string | number[]): number[] {
  if (typeof data === 'string') {
    // 用 UTF-8 编码；对 ASCII 与经典测试向量与逐字节处理一致。
    const encoder = new TextEncoder();
    return Array.from(encoder.encode(data));
  }
  return data;
}

/**
 * FNV-1a 32-bit 哈希。
 *
 * @param data 输入（字符串按 UTF-8 取字节，或直接给字节数组）
 * @param hooks 可选事件钩子
 * @returns 32 位无符号哈希值 ([0, 2^32))
 */
export function fnv1a(data: string | number[], hooks: FnvHashHooks = {}): number {
  const bytes = toBytes(data);
  let hash = FNV_OFFSET_BASIS_32;
  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes[i]!;
    // 1) XOR
    hash = hash ^ byte;
    // 2) multiply by FNV_prime，取低 32 位（用 >>>0 归一为无符号）
    hash = imul32(hash, FNV_PRIME_32) >>> 0;
    hooks.onOctet?.(i, byte, hash);
  }
  hash = hash >>> 0; // 确保无符号
  hooks.onResult?.(hash);
  return hash;
}

/** 32 位有符号乘法（等价于 C 的 uint32 乘法溢出截断）。Math.imul 跨平台一致。 */
function imul32(a: number, b: number): number {
  return Math.imul(a, b);
}

/**
 * 批量便捷：对多个输入分别哈希。
 * @param inputs 字符串或字节数组数组
 * @returns 每个输入的 32 位哈希
 */
export function fnv1aBatch(inputs: Array<string | number[]>): number[] {
  return inputs.map((d) => fnv1a(d));
}
