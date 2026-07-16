// MurmurHash2A · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'hash-murmur2a',
  categoryId: 'hashing',
  title: { zh: 'MurmurHash2A', en: 'MurmurHash2A' },
  summary: {
    zh: 'MurmurHash2A：Murmur2 的改进版，尾部混合更稳健。',
    en: 'MurmurHash2A: improved Murmur2 with sturdier tail mixing.',
  },
  description: {
    zh: 'MurmurHash2A：在 Murmur2 基础上引入 tail 处理：将尾部字节加入 h 而非独立 tail，混合更均匀。',
    en: 'MurmurHash2A: introduces sturdier tail handling than Murmur2, folding tail bytes into h directly for better distribution.',
  },
  tags: ['hashing', 'non-crypto', 'murmur'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
