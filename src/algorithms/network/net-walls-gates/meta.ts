// 墙与门 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-walls-gates',
  categoryId: 'network',
  title: { zh: '墙与门', en: 'Walls and Gates' },
  summary: {
    zh: '每个房间填到最近门的距离（-1 墙、INF 空、0 门）。',
    en: 'Fill each empty room with distance to nearest gate.',
  },
  description: { zh: '多源 BFS：所有门同时入队。', en: 'Multi-source BFS from all gates. O(R*C).' },
  tags: ['network', 'grid', 'multi-bfs'],
  complexity: { time: 'O(R*C)', space: 'O(R*C)' },
};
