// 匈牙利算法（Kuhn 增广路二分图匹配）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hungarian-matching',
  categoryId: 'network',
  title: { zh: '匈牙利算法（Kuhn 匹配）', en: 'Hungarian (Kuhn Bipartite Matching)' },
  summary: {
    zh: '对每个左侧点 DFS 找增广路，O(V·E) 求二分图最大匹配。',
    en: 'For each left vertex, DFS an augmenting path; O(V·E) bipartite maximum matching.',
  },
  description: {
    zh: "匈牙利算法（Kuhn 方法）求二分图最大匹配：\n\n- 对每个左侧点 `u`，尝试 DFS 找一条增广路：\n  - 遍历 `u` 的邻接右侧点 `v`：\n    - 若 `v` 未匹配，直接配对成功；\n    - 若 `v` 已匹配给 `u'`，递归尝试给 `u'` 另找匹配，成功则腾出 `v` 给 `u`。\n  - 每轮 DFS 用 visited 数组避免对同一右侧点重复访问。\n- 所有左侧点尝试完毕，匹配数即为最大匹配。\n\n时间 `O(V·E)`，空间 `O(V+E)`。简单直观，是 Hopcroft-Karp 的「朴素前身」。",
    en: 'The Hungarian (Kuhn) algorithm for maximum bipartite matching:\n\n- For each left vertex `u`, try to DFS an augmenting path:\n  - For each neighbor `v` of `u`:\n    - If `v` is free, match directly;\n    - If `v` is matched to `u\'`, recursively try to rematch `u\'`; on success `v` goes to `u`.\n  - A per-DFS `visited` array prevents revisiting the same right vertex.\n- After all left vertices tried, the matching is maximum.\n\nTime `O(V·E)`, space `O(V+E)`. Simple and direct; the "naive ancestor" of Hopcroft-Karp.',
  },
  tags: ['network', 'matching', 'bipartite', 'dfs'],
  complexity: { time: 'O(V·E)', space: 'O(V + E)' },
};
