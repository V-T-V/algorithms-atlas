// 腐烂橘子 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-rotten-oranges',
  categoryId: 'network',
  title: { zh: '腐烂橘子', en: 'Rotten Oranges' },
  summary: {
    zh: '每分钟四向传染，求所有橘子腐烂的最少分钟。',
    en: 'Min minutes to rot all oranges (4-dir per minute).',
  },
  description: { zh: '多源 BFS，所有初始腐烂点入队。', en: 'Multi-source BFS. O(R*C).' },
  tags: ['network', 'grid', 'multi-bfs'],
  complexity: { time: 'O(R*C)', space: 'O(R*C)' },
};
