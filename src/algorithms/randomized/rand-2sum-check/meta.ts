// 随机 2-SUM 检验 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-2sum-check',
  categoryId: 'randomized',
  title: { zh: '随机 2-SUM 检验', en: 'Randomized 2-SUM Check' },
  summary: {
    zh: '随机化检验数组中两数和为目标值。',
    en: 'Randomized check for two-sum equals target.',
  },
  description: { zh: '用哈希集 + 随机子集抽样加速。', en: 'Hash set + random subset sampling.' },
  tags: ['randomized', 'verification'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
