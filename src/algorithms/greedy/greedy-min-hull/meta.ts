// 凸包 Gift Wrapping（Gift Wrapping Convex Hull）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'greedy-min-hull',
  categoryId: 'greedy',
  title: { zh: '凸包 Gift Wrapping', en: 'Gift Wrapping Convex Hull' },
  summary: {
    zh: '从最左点开始，每次选使所有点同侧的下一顶点，贪心包出凸包。',
    en: 'Start at the leftmost point; each step pick the next vertex keeping all points on one side.',
  },
  description: {
    zh: 'Gift Wrapping（Jarvis 步进）：从最下点开始，反复选相对当前方向逆时针转角最小的点，直到回到起点。',
    en: 'Gift wrapping (Jarvis march): start at lowest point; repeatedly pick the point with smallest counterclockwise turn.',
  },
  tags: ['greedy', 'geometry', 'convex-hull'],
  complexity: { time: 'O(nh)', space: 'O(h)' },
};
