// RTA* 实时 A*（Real-Time A*）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ais-rta-star',
  categoryId: 'ai-search',
  title: { zh: 'RTA* 实时 A*', en: 'Real-Time A*' },
  summary: {
    zh: '每步选最优邻居并把 h 设为次优。',
    en: 'Each step picks best neighbor, h set to 2nd best.',
  },
  description: {
    zh: 'RTA*(Korf 1990)每步选择使 h 最小的邻居移动，并把当前节点 h 改写为次小邻居 h+1，单次试跑。',
    en: 'RTA* moves to the neighbor with smallest h and rewrites the current h to the second-smallest neighbor h+1.',
  },
  tags: ['ai-search', 'rta-star', 'real-time'],
  complexity: { time: 'O(b) per step', space: 'O(n)' },
};
