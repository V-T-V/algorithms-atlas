// GOST（简化） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'hash-gost-impl',
  categoryId: 'hashing',
  title: { zh: 'GOST（简化）', en: 'GOST (simplified)' },
  summary: {
    zh: 'GOST：俄罗斯标准的密码学哈希（GOST R 34.11）。',
    en: 'GOST: Russian standard cryptographic hash (GOST R 34.11).',
  },
  description: {
    zh: 'GOST R 34.11：俄罗斯国家标准哈希，基于块密码。简化 256 位教学版。',
    en: 'GOST R 34.11: Russian national standard hash built on a block cipher. Simplified 256-bit teaching version.',
  },
  tags: ['hashing', 'cryptographic'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
