// 太平洋大西洋水流 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-pacific-atlantic',
  categoryId: 'network',
  title: { zh: '太平洋大西洋水流', en: 'Pacific Atlantic Water Flow' },
  summary: { zh: '找能同时流向两大洋的格子。', en: 'Cells that can flow to both oceans.' },
  description: {
    zh: '从两大洋边界反向 DFS，取交集。',
    en: 'DFS from both ocean borders, intersect. O(R*C).',
  },
  tags: ['network', 'grid', 'dfs'],
  complexity: { time: 'O(R*C)', space: 'O(R*C)' },
};
