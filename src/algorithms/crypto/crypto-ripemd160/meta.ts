// RIPEMD-160（RIPEMD-160）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'crypto-ripemd160',
  categoryId: 'crypto',
  title: { zh: 'RIPEMD-160', en: 'RIPEMD-160' },
  summary: {
    zh: 'RIPEMD-160：双并行 MD4 风格 160 位哈希。',
    en: 'RIPEMD-160: dual parallel MD4-style 160-bit hash.',
  },
  description: {
    zh: 'RIPEMD-160（Dobbertin 等 1996）两条并行 MD4 改进链（左/右各 5 轮 16 步）后合并，输出 160 位。',
    en: 'RIPEMD-160 (Dobbertin et al. 1996) runs two parallel MD4-improved chains (left/right, each 5 rounds × 16 steps) and combines them to produce 160 bits.',
  },
  tags: ['crypto', 'ripemd', 'hash', 'parallel'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
