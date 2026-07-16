// XXH3 混合（XXH3 Mix）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-xxh3-mix',
  categoryId: 'hashing',
  title: { zh: 'XXH3 混合', en: 'XXH3 Mix' },
  summary: {
    zh: 'XXH3 用固定 secret 与输入字交错乘加，达到 SIMD 友好高吞吐。',
    en: 'XXH3 interleaves input with a fixed secret via multiply-add; SIMD-friendly high throughput.',
  },
  description: {
    zh: 'XXH3 简化：把输入分块，与 secret 常数做乘加 + 旋转，最后 avalanche。极快且分布好。',
    en: 'XXH3 simplified: split input into blocks, multiply-add with secret constants + rotate, then avalanche. Very fast.',
  },
  tags: ['hashing', 'non-cryptographic', 'xxhash'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
