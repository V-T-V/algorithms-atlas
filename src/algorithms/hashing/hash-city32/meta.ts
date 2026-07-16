// CityHash32 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'hash-city32',
  categoryId: 'hashing',
  title: { zh: 'CityHash32', en: 'CityHash32' },
  summary: {
    zh: 'Google CityHash32：针对短键优化的 32 位非加密哈希。',
    en: 'Google CityHash32: 32-bit non-crypto hash optimized for short keys.',
  },
  description: {
    zh: 'CityHash32（Google）：为短字符串优化的 32 位哈希。本实现是简化教学版，强调乘加混合。',
    en: 'CityHash32 (Google): 32-bit hash optimized for short strings. Simplified teaching version emphasizing multiply-add mixing.',
  },
  tags: ['hashing', 'non-crypto', 'city'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
