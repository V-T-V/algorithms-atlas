// 贪心设计范式 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'greedy-design',
  categoryId: 'design',
  title: { zh: '贪心设计范式', en: 'Greedy Paradigm' },
  summary: {
    zh: '每步选当前最优（局部最优）以期全局最优：需证明贪心选择性质与最优子结构。',
    en: 'At each step pick the locally best option hoping for a global optimum: requires proving the greedy-choice and optimal-substructure properties.',
  },
  description: {
    zh: '贪心算法（Greedy）在每一步选择「当前看来最好」的选项，不回退、不搜索所有可能。它比 DP 更快（常 O(n log n)），但仅当问题具备两条性质时才正确：\n\n1. **贪心选择性质**：局部最优选择能导致全局最优\n2. **最优子结构**：子问题的最优解能组合成原问题最优解\n\n经典正确实例：\n- **区间调度**（最多不相交区间）：按结束时间排序，贪心选最早结束\n- **Huffman 编码**：每次合并频率最低两棵树\n- **分数背包**：按单位价值降序贪心装\n- **最小生成树**（Kruskal/Prim）\n- **Dijkstra 最短路**（非负权）\n\n反例：0-1 背包用贪心未必最优；找零在任意币制下未必最优。\n\n本实现以「区间调度」为载体展示贪心的选择策略与正确性证明要点。',
    en: 'A greedy algorithm picks the "currently best" option at each step, with no backtracking or exhaustive search. It is faster than DP (often O(n log n)) but only correct when the problem has two properties:\n\n1. **Greedy-choice property**: a locally optimal choice leads to a global optimum\n2. **Optimal substructure**: optimal solutions to subproblems combine into an optimal solution\n\nCanonical correct instances:\n- **Interval scheduling** (max non-overlapping intervals): sort by end time, greedily pick the earliest ending\n- **Huffman coding**: repeatedly merge the two lowest-frequency trees\n- **Fractional knapsack**: greedily take by descending unit value\n- **Minimum spanning tree** (Kruskal/Prim)\n- **Dijkstra shortest path** (non-negative weights)\n\nCounter-examples: the 0-1 knapsack is not always optimal greedily; coin change is not always optimal under arbitrary denominations.\n\nThis implementation uses interval scheduling to show the greedy strategy and the key proof obligations.',
  },
  tags: ['design', 'paradigm', 'greedy', 'interval-scheduling'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
