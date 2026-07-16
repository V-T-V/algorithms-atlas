// 项目选择（最大权闭合子图）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'project-selection',
  categoryId: 'network',
  title: { zh: '项目选择（最大权闭合子图）', en: 'Project Selection (Max-Weight Closure)' },
  summary: {
    zh: '选项目获利且依赖必须先选：转化为最大权闭合子图 → 最小割求解。',
    en: 'Pick profitable projects honoring dependencies: reduce to max-weight closure → min-cut.',
  },
  description: {
    zh: '项目选择问题：有 n 个项目，项目 i 选中得利润 profit[i]（可为负，表示成本）。依赖关系 deps: 若选了项目 v 则必须选项目 u（u 是 v 的前置）。求总利润最大的选择方案。\n\n**转化为最大权闭合子图**：把每个项目当作图中的一个点，依赖 v→u 变成有向边 u→v（「选 v 必须能到达 u」即闭合性）。在闭合子图中所有点的权和最大。\n\n**最小割解法**：\n1. 构造源 s、汇 t。对每个利润为正的点 i，连 s→i 容量 profit[i]；对每个利润为负的点 i，连 i→t 容量 −profit[i]。\n2. 依赖边 u→v 容量 ∞（防止被割）。\n3. 设 W = 所有正利润之和。最大权闭合子图权值 = W − (s-t 最小割)。\n4. 最小割把点分成 S 侧（与 s 连通）与 T 侧。**选中集合 = S 侧的非源点**。\n\n直观：最小割等于「放弃的正利润 + 承担的负成本」之和；用总正利润减去它即得净收益。',
    en: 'Project selection: n projects, project i yields profit[i] (may be negative = cost). Dependencies deps: if you pick v you must pick u (u is a prerequisite of v). Maximize total profit.\n\n**Reduction to max-weight closure**: each project is a vertex; a dependency v→u becomes a directed edge u→v (closure = "if you pick v you can reach u"). Maximize the weight sum over closed vertex sets.\n\n**Min-cut solution**:\n1. Add source s and sink t. For each positive-weight vertex i, add edge s→i with capacity profit[i]; for each negative-weight vertex i, add edge i→t with capacity −profit[i].\n2. Dependency edges u→v have capacity ∞ (cannot be cut).\n3. Let W = sum of all positive profits. Max closure weight = W − (s-t min-cut).\n4. The cut partitions vertices into the S-side (reachable from s) and T-side. **The selected set = S-side non-source vertices**.\n\nIntuition: the min-cut equals "foregone positive profit + incurred negative cost"; subtracting it from total positive profit gives net gain.',
  },
  tags: ['network', 'project-selection', 'closure', 'min-cut', 'max-flow'],
  complexity: { time: 'O(V²·E)', space: 'O(V + E)' },
};
