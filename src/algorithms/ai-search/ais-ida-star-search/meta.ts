// IDA* 迭代加深 A*（IDA* Search）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ais-ida-star-search',
  categoryId: 'ai-search',
  title: { zh: 'IDA* 迭代加深 A*', en: 'IDA* Search' },
  summary: {
    zh: '带启发式阈值的迭代加深搜索。',
    en: 'Iterative deepening with heuristic threshold.',
  },
  description: {
    zh: 'IDA* 结合迭代加深与 A* 启发式，每轮以 f=g+h 不超过阈值为界深度优先，阈值随未能找到解的最小越界值递增。',
    en: 'IDA* combines iterative deepening with A* heuristic; each round DFS-bounds f=g+h by a threshold that grows.',
  },
  tags: ['ai-search', 'ida-star', 'heuristic', 'search'],
  complexity: { time: 'O(b^d)', space: 'O(d)' },
};
