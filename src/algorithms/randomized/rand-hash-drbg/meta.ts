// Hash DRBG · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rand-hash-drbg',
  categoryId: 'randomized',
  title: { zh: 'Hash DRBG', en: 'Hash DRBG' },
  summary: {
    zh: 'NIST SP 800-90A 基于哈希的确定性随机比特生成器（教学简化版）。',
    en: 'A simplified educational Hash DRBG per NIST SP 800-90A.',
  },
  description: {
    zh: 'Hash_DRBG 维护内部状态 V 与常量 C，每次请求：V = V + H(V) + C + reseed_counter（mod 2^bits），输出 H(V) 的前 requested_bits。本实现用 SHA-1 风格的简化哈希演示。',
    en: 'Hash_DRBG keeps internal state V and constant C; on each request it computes V = V + H(V) + C + reseed_counter (mod 2^bits) and outputs the leading bits of H(V). This is a simplified SHA-style demo.',
  },
  tags: ['randomized', 'prng', 'drbg', 'hash', 'nist'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
