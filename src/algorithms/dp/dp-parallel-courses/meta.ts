import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-parallel-courses',
  categoryId: 'dp',
  title: { zh: '并行课程', en: 'Parallel Courses' },
  summary: {
    zh: 'n 门课有先修依赖，可并行修读，求修完最少学期数。',
    en: 'n courses with prerequisites; take them in parallel; find the minimum semesters.',
  },
  description: {
    zh: 'LeetCode 1136。n 门课，依赖关系 relations[i]=[prevCourse,nextCourse]，每学期可同时修任意多门已满足先修的课。求修完所有课的最少学期数；若有环返回 -1。拓扑排序 + DP：用 Kahn 按层处理，dist[v]=max(dist[v], dist[u]+1)，层数即为答案。时间 O(V+E)，空间 O(V+E)。',
    en: 'LeetCode 1136. n courses with prerequisites; take unlimited courses per semester once prerequisites met; find min semesters (-1 if cyclic). Topological sort + DP: dist[v]=max(dist[v],dist[u]+1); the answer is the max layer depth. Time O(V+E), space O(V+E).',
  },
  tags: ['dp', 'topological-sort', 'leetcode'],
  complexity: { time: 'O(V+E)', space: 'O(V+E)' },
};
