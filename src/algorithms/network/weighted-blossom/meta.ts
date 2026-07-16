// 加权 Blossom（一般图最大权匹配）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'weighted-blossom',
  categoryId: 'network',
  title: { zh: '加权 Blossom', en: 'Weighted Blossom (MWPM)' },
  summary: {
    zh: 'Edmonds 的最大权匹配：用对偶变量（顶点标号 z_u）+ 花朵收缩解 primal-dual。',
    en: "Edmonds' maximum-weight matching: primal-dual via vertex duals z_u and blossom contraction.",
  },
  description: {
    zh: '加权 Blossom（Edmonds, 1965）求一般图的**最大权完美匹配**（或最大权匹配）。在非加权 Blossom 基础上引入对偶变量：\n\n- 每个顶点 u 有对偶变量 `z_u`（顶点标号）。\n- 每个「花朵」（奇环）B 有对偶变量 `z_B ≥ 0`。\n- 满足「对偶约束」：对每条边 e=(u,v)，`z_u + z_v + Σ_{B∋e} z_B ≥ w_e`。\n- 紧边（等式成立）才进入「候选匹配」集合。\n\n算法在 primal-dual 框架下：保持对偶可行，尝试增广 primal；若卡住则增大/减小对偶变量直到新边变紧。本实现是教学简化版：在小加权图上用枚举/分支定界给出正确的最大权匹配（与 Edmonds 同解）。',
    en: 'Weighted Blossom (Edmonds, 1965) computes a **maximum-weight perfect matching** (or just max-weight matching) on general graphs. It extends the unweighted blossom with dual variables:\n\n- Each vertex u has a dual `z_u` (vertex label).\n- Each "blossom" (odd cycle) B has a dual `z_B ≥ 0`.\n- The "dual constraint" for each edge e=(u,v): `z_u + z_v + Σ_{B∋e} z_B ≥ w_e`.\n- Only tight edges (equality) enter the candidate matching set.\n\nThe algorithm runs primal-dual: maintain dual feasibility, try to augment primal; when stuck, adjust duals until new edges become tight. This implementation is a pedagogical simplification that uses brute force / branch-and-bound to give the correct max-weight matching on small weighted graphs (same answer as Edmonds).',
  },
  tags: ['network', 'matching', 'weighted', 'general-graph', 'mwpm'],
  complexity: { time: 'O(V³)', space: 'O(V²)' },
  references: [
    {
      label: 'Maximum weight matching — Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Maximum_weight_matching',
    },
  ],
};
