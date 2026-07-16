// CityHash64 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'hash-city64',
  categoryId: 'hashing',
  title: { zh: 'CityHash64', en: 'CityHash64' },
  summary: {
    zh: 'Google CityHash64：64 位非加密哈希，针对中等长度字符串优化。',
    en: 'Google CityHash64: 64-bit non-crypto hash tuned for medium-length strings.',
  },
  description: {
    zh: 'CityHash64（Google）：为 64 位平台优化的非加密哈希。本实现为简化 BigInt 版本，强调乘加雪崩。',
    en: 'CityHash64 (Google): non-crypto hash optimized for 64-bit platforms. Simplified BigInt version emphasizing multiply-add avalanche.',
  },
  tags: ['hashing', 'non-crypto', 'city'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
