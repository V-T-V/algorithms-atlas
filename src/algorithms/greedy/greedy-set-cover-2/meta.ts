// 集合覆盖（贪心近似） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-set-cover-2',
  categoryId: 'greedy',
  title: { zh: '集合覆盖（贪心近似）', en: 'Set Cover (Greedy)' },
  summary: {
    zh: '每次选能覆盖最多未覆盖元素的集合，得到 ln(n) 近似。',
    en: 'Pick the set covering the most uncovered elements each step; ln(n) approximation.',
  },
  description: {
    zh: '集合覆盖是 NP-hard，贪心给出 H(n) ≤ ln(n)+1 近似：每步选覆盖新元素最多的子集。',
    en: 'Set cover is NP-hard; greedy gives H(n) ≤ ln(n)+1 approximation by picking the set covering the most new elements each step.',
  },
  tags: ['greedy', 'approximation'],
  complexity: { time: 'O(n·m)', space: 'O(n+m)' },
};
