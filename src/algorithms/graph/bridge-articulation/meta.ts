// Bridges & Articulation Points · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bridge-articulation',
  categoryId: 'graph',
  title: { zh: '桥与割点', en: 'Bridges & Articulation Points' },
  summary: {
    zh: '桥与割点属于graph类别。',
    en: 'Bridges & Articulation Points is a graph algorithm.',
  },
  description: {
    zh: '桥与割点（Bridges & Articulation Points）属于graph类别的算法。',
    en: 'Bridges & Articulation Points is an algorithm in the graph category.',
  },
  tags: ["graph","graph-connectivity"],
  complexity: { time: 'O(V + E)', space: 'O(V)' },
};
