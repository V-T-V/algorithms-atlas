// xxHash (XXH32) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'xxhash-impl',
  categoryId: 'hashing',
  title: { zh: 'xxHash (XXH32)', en: 'xxHash (XXH32)' },
  summary: {
    zh: '「乘大常数 + 每四字节一累加旋转」的极快非加密哈希，性能近内存带宽。',
    en: 'A blazing non-cryptographic hash (multiply-large-constant + per-4-byte accumulate-rotate), near memory bandwidth.',
  },
  description: {
    zh: 'xxHash 由 Yann Collet 设计，是目前最快的非加密哈希之一。XXH32 是其 32 位版本：核心是 4 个独立的 32 位累加器（acc1..acc4），各预置魔数 PRIME32 的乘积作为初值。输入按 16 字节大块（stripe）处理：每个 4 字节 lane 乘 PRIME32_2、旋转 17 位、再乘 PRIME32_1，混入对应累加器。处理完所有 stripe 后，4 个累加器合并（各旋转并乘 PRIME32_1）。剩余 0~15 字节尾部按 4/2/1 字节逐段消化。最后把总长度乘 PRIME32_2 异或入累加值并做雪崩（avalanche：右移异或×4 配 PRIME32_乘），得到最终 32 位值。设计强调少分支、大乘法常数、独立 lane 并行，现代 CPU 上可逼近内存带宽极限。',
    en: 'xxHash, designed by Yann Collet, is among the fastest non-cryptographic hashes. XXH32 is the 32-bit variant: its core uses four independent 32-bit accumulators (acc1..acc4) seeded from products of the magic PRIME32 constants. Input is consumed in 16-byte stripes: each 4-byte lane is multiplied by PRIME32_2, rotated 17 bits, multiplied by PRIME32_1, then merged into its accumulator. After all stripes the four accumulators are merged (each rotated and multiplied by PRIME32_1). Trailing 0~15 bytes are digested in 4/2/1-byte chunks. Finally the total length × PRIME32_2 is XOR-folded in and an avalanche step (four shift-XORs paired with PRIME32 multiplies) yields the 32-bit result. The design favours few branches, large multiplicative constants, and parallel independent lanes, reaching near memory-bandwidth speed on modern CPUs.',
  },
  tags: ['hashing', 'non-cryptographic', 'checksum'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
