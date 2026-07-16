// LRTA* 实时学习 A*（Learning Real-Time A*）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ais-lrta-star',
  categoryId: 'ai-search',
  title: { zh: 'LRTA* 实时学习 A*', en: 'Learning Real-Time A*' },
  summary: {
    zh: '实时启发式搜索，边走边更新 h 表。',
    en: 'Real-time heuristic search updating h as it moves.',
  },
  description: {
    zh: 'LRTA*(Korf 1990)每步选择使 g+h 最小的邻居并把当前 h 增大到最小邻居 h+1，多轮后收敛到最优。',
    en: 'LRTA* picks the neighbor minimizing g+h and raises h toward neighbor h+1 each step; converges to optimal over trials.',
  },
  tags: ['ai-search', 'lrta-star', 'real-time', 'learning'],
  complexity: { time: 'O(n) per step', space: 'O(n)' },
};
