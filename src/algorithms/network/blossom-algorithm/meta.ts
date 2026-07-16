// Blossom 算法（一般图最大匹配）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'blossom-algorithm',
  categoryId: 'network',
  title: { zh: 'Blossom 算法', en: 'Blossom Algorithm' },
  summary: {
    zh: 'Edmonds 的「花朵收缩」算法，求一般图（非二分图）的最大匹配。',
    en: "Edmonds' blossom-shrinking algorithm for maximum matching on general (non-bipartite) graphs.",
  },
  description: {
    zh: 'Blossom 算法（Edmonds, 1965）求解任意图的最大基数匹配。关键难点：在二分图中，交替路总是连接两侧；但在一般图中可能出现「奇环」（blossom/花朵）——一个奇数长度的交替环。\n\nEdmonds 的核心思想：\n1. 从任一未匹配点出发用 BFS 构造「交替树」，节点分内（even）/外（odd）层。\n2. 若找到另一未匹配点 → 找到增广路，翻转匹配。\n3. 若两个外节点相邻 → 形成「花朵」（奇环）：把整个花朵收缩为一个超级节点，在收缩图上继续搜索。\n4. 增广后「展开」花朵恢复原始匹配。\n\n复杂度 `O(V²·E)`（带合适实现）。本实现用 BFS + 并查集花朵收缩的简化版本。',
    en: 'The Blossom algorithm (Edmonds, 1965) finds a maximum-cardinality matching on arbitrary graphs. The key difficulty: in bipartite graphs alternating paths always connect the two sides, but in general graphs "blossoms" can appear — odd-length alternating cycles.\n\nEdmonds\' core idea:\n1. From an unmatched vertex use BFS to build an "alternating tree", labeling nodes even/odd.\n2. If another unmatched vertex is reached → an augmenting path is found, flip the matching.\n3. If two even-labeled vertices are adjacent → a "blossom" (odd cycle) forms: contract it into a super-vertex and continue on the contracted graph.\n4. After augmenting, "expand" the blossom to recover the original matching.\n\nComplexity `O(V²·E)`. This implementation uses a simplified BFS + union-find blossom contraction.',
  },
  tags: ['network', 'matching', 'general-graph', 'blossom', 'edmonds'],
  complexity: { time: 'O(V²·E)', space: 'O(V + E)' },
  references: [
    {
      label: 'Blossom algorithm — Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Blossom_algorithm',
    },
  ],
};
