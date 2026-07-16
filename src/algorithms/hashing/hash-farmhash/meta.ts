// hash-farmhash · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-farmhash',
  categoryId: 'hashing',
  title: { zh: 'FarmHash', en: 'FarmHash' },
  summary: {
    zh: 'FarmHash64：CityHash 的继任者，Google 为字符串哈希优化，避免 SIMD 依赖。',
    en: 'FarmHash64: CityHash successor optimized by Google for string hashing without SIMD dependencies.',
  },
  description: {
    zh: 'FarmHash（Pike 等）：\n\n- CityHash 的进化版，去掉对 SSE4.2 的依赖。\n- 同样用大素数乘法 + 旋转混合。\n- 用于 Google 内部字符串去重、布隆过滤。本实现为简化 64 位 BigInt 版。',
    en: 'FarmHash (Pike et al.):\n\n- Evolution of CityHash without SSE4.2 dependency.\n- Same large-prime multiply + rotate mixing.\n- Used internally at Google for dedup and bloom filters. Simplified 64-bit BigInt variant here.',
  },
  tags: ['hashing', 'non-cryptographic', 'farmhash'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
