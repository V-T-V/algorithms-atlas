import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-course-schedule-2',
  categoryId: 'graph',
  title: { zh: '课程表 II', en: 'Course Schedule II' },
  summary: {
    zh: '输出一种合法的修课顺序（拓扑序），不可行返回空。',
    en: 'Return a valid course order (topological order); empty if infeasible.',
  },
  description: {
    zh: 'LeetCode 210。共 numCourses 门课，prerequisites[i]=[a,b] 表示先修 b。返回任意一种能把所有课修完的顺序；若存在环（不可行）返回空数组。Kahn 拓扑排序：入度为 0 者入队，逐个取出输出并削减后继入度；若输出数 < numCourses 则有环，返回 []。时间 O(V+E)，空间 O(V+E)。',
    en: 'LeetCode 210. Return any order that finishes all courses given prerequisites [a,b]; [] if cyclic. Kahn sort: enqueue zero-in-degree nodes, output and reduce successors; if fewer than numCourses output, return []. Time O(V+E), space O(V+E).',
  },
  tags: ['topological-sort', 'bfs', 'leetcode'],
  complexity: { time: 'O(V+E)', space: 'O(V+E)' },
};
