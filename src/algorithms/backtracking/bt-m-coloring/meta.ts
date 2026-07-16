// 图m着色 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-m-coloring',
  categoryId: 'backtracking',
  title: { zh: '图m着色', en: 'Graph M-Coloring' },
  summary: {
    zh: '判断无向图能否用 m 种颜色着色使相邻不同色。',
    en: 'Can color graph with m colors so adjacent differ.',
  },
  description: { zh: '回溯逐节点试色。', en: 'Try colors per vertex. O(m^V).' },
  tags: ['backtracking', 'coloring'],
  complexity: { time: 'O(m^V)', space: 'O(V)' },
};
