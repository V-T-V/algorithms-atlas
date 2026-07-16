// FarmHash32 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'hash-farm32',
  categoryId: 'hashing',
  title: { zh: 'FarmHash32', en: 'FarmHash32' },
  summary: {
    zh: 'Google FarmHash32：CityHash 的后继，针对短字符串优化。',
    en: 'Google FarmHash32: successor to CityHash, tuned for short strings.',
  },
  description: {
    zh: 'FarmHash（Google）：CityHash 的后继，注重短键性能与分布。简化 32 位版本。',
    en: 'FarmHash (Google): successor to CityHash with focus on short-key performance and distribution. Simplified 32-bit variant.',
  },
  tags: ['hashing', 'non-crypto', 'farm'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
