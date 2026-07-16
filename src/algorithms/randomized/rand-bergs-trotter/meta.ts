// Bogle 随机化计数 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-bergs-trotter',
  categoryId: 'randomized',
  title: { zh: 'Bogle 随机化计数', en: 'Randomized Counting (Bogle)' },
  summary: {
    zh: '估计大集合基数的随机化算法。',
    en: 'Randomized algorithm to estimate large set cardinality.',
  },
  description: {
    zh: '采样哈希最低位 1 的位置估计。',
    en: 'Sample position of lowest set bit of hash.',
  },
  tags: ['randomized', 'estimation'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
