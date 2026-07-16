// 课程表 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-course-schedule',
  categoryId: 'network',
  title: { zh: '课程表', en: 'Course Schedule' },
  summary: {
    zh: '判断 prerequisites 是否能完成（拓扑判环）。',
    en: 'Whether all courses can be finished (cycle detection).',
  },
  description: {
    zh: '拓扑排序，若 order 不全则有环。',
    en: 'Topo sort; incomplete => cycle. O(V+E).',
  },
  tags: ['network', 'graph', 'topological-sort'],
  complexity: { time: 'O(V+E)', space: 'O(V)' },
};
