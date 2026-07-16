// Kuhn 匈牙利增广路匹配 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'kuhn-matching',
  categoryId: 'network',
  title: { zh: 'Kuhn 增广路匹配', en: 'Kuhn Augmenting-Path Matching' },
  summary: {
    zh: '二分图最大匹配：逐个左点 DFS 找增广路，复杂度 O(V·E)。',
    en: 'Maximum bipartite matching via per-left-vertex DFS augmenting paths; O(V·E).',
  },
  description: {
    zh: 'Kuhn 算法求二分图最大匹配。二分图分为左部 L（0..nLeft-1）与右部 R（0..nRight-1）。\n\n核心思想：**增广路**。维护 `matchR[r]` = 当前与右点 r 匹配的左点（-1 表示未匹配）。对每个左点 u 尝试寻找增广路：\n1. 从 u 出发 DFS，遍历它的右部邻居 r。\n2. 若 r 未被匹配，或 r 的当前匹配者 `matchR[r]` 能找到另外的增广路，则把 r 让给 u，返回成功。\n3. 每轮 DFS 用一个 `visited` 标记防止右点被重复访问。\n\n若某左点找到增广路，匹配数 +1。所有左点尝试完毕即得最大匹配。\n\n复杂度：每轮 DFS 是 O(E)，共 nLeft 轮，总计 O(V·E)。注意这与「匈牙利权值匹配」(Kuhn-Munkres) 不同——本算法处理无权二分图的最大基数匹配。',
    en: "Kuhn's algorithm finds a maximum matching in a bipartite graph with left part L (0..nLeft-1) and right part R (0..nRight-1).\n\nKey idea: **augmenting path**. Maintain `matchR[r]` = the left vertex currently matched to right vertex r (-1 if unmatched). For each left vertex u, try to find an augmenting path:\n1. From u, DFS over its right neighbors r.\n2. If r is unmatched, or r's current match `matchR[r]` can find an alternate path, reassign r to u and succeed.\n3. Each DFS round uses a `visited` flag to avoid revisiting a right vertex.\n\nEach successful augment increases the matching by one. After all left vertices are tried, the matching is maximum.\n\nComplexity: each DFS is O(E), nLeft rounds total, so O(V·E). Note this differs from weighted Hungarian (Kuhn-Munkres) — this handles unweighted maximum-cardinality bipartite matching.",
  },
  tags: ['network', 'bipartite-matching', 'augmenting-path', 'dfs'],
  complexity: { time: 'O(V·E)', space: 'O(V + E)' },
};
