// 网格洪泛填充 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-grid-flood-fill',
  categoryId: 'network',
  title: { zh: '网格洪泛填充', en: 'Grid Flood Fill' },
  summary: {
    zh: '把网格中连通的同色区域改为新颜色。',
    en: 'Change connected same-color region to a new color.',
  },
  description: { zh: '从起点 DFS/BFS 改色。', en: 'DFS/BFS from seed. O(R*C).' },
  tags: ['network', 'grid', 'flood-fill'],
  complexity: { time: 'O(R*C)', space: 'O(R*C)' },
};
