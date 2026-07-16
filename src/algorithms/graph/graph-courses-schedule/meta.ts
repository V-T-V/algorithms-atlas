import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-courses-schedule',
  categoryId: 'graph',
  title: { zh: '课程表', en: 'Course Schedule' },
  summary: {
    zh: '判断给定的先修依赖能否全部修完（无环 DAG）。',
    en: 'Determine if all courses can be finished given prerequisites (acyclic check).',
  },
  description: {
    zh: 'LeetCode 207。共 numCourses 门课，prerequisites[i]=[a,b] 表示要先修 b 才能修 a。判断能否修完所有课（即依赖关系无环）。用 Kahn 拓扑排序：统计入度，反复取出入度为 0 的课；若能取出全部则无环可完成，否则存在环。时间 O(V+E)，空间 O(V+E)。',
    en: 'LeetCode 207. numCourses with prerequisites [a,b] (b before a). Determine feasibility (no dependency cycle). Kahn topological sort: count in-degrees, repeatedly remove zero-in-degree nodes; if all removed then acyclic and feasible. Time O(V+E), space O(V+E).',
  },
  tags: ['topological-sort', 'bfs', 'cycle-detection', 'leetcode'],
  complexity: { time: 'O(V+E)', space: 'O(V+E)' },
};
