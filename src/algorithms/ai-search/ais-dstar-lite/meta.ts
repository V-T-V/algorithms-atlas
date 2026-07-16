// D* Lite（D* Lite）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ais-dstar-lite',
  categoryId: 'ai-search',
  title: { zh: 'D* Lite', en: 'D* Lite' },
  summary: {
    zh: '增量式启发式搜索，环境变化时高效重规划。',
    en: 'Incremental heuristic replanning under dynamic costs.',
  },
  description: {
    zh: 'D* Lite(Koenig & Likhachev)在代价变化时只重算受影响节点，常用于移动机器人路径重规划。',
    en: 'D* Lite recomputes only affected nodes when edge costs change; widely used in robot replanning.',
  },
  tags: ['ai-search', 'd-star', 'incremental', 'dynamic'],
  complexity: { time: 'O(k log n)', space: 'O(n)' },
};
