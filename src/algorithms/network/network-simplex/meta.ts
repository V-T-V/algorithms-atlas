// 网络单纯形（Network Simplex）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'network-simplex',
  categoryId: 'network',
  title: { zh: '网络单纯形', en: 'Network Simplex' },
  summary: {
    zh: '把最小费用流转为生成树基解，反复用「负费用入边换正费用出边」迭代。',
    en: 'Reframe min-cost flow as a spanning-tree basic solution; iteratively swap a negative-cost entering edge for a positive-cost leaving edge.',
  },
  description: {
    zh: '网络单纯形是求解最小费用流的最强实用算法：把一个流看作「生成树 + 非树边」的基解（树边确定节点势能，非树边流量为 0 或满）。每次：\n\n1. 由当前生成树计算各节点势能 π（使树边 reduced cost = 0）。\n2. 找一条 reduced cost < 0 的非树边作为「入边」e_enter。\n3. 加入 e_enter 在树上形成一个环；环上某条边方向相反，流量将被抵消，找到最先达到 0 或 cap 的边作为「出边」e_leave。\n4. 用 e_enter 替换 e_leave，更新生成树。\n5. 重复直到所有非树边 reduced cost ≥ 0（最优）。\n\n实践中极快，最坏复杂度未严格证明多项式，但平均近线性。',
    en: 'Network simplex is the most practically powerful algorithm for min-cost flow: it views a flow as a "spanning tree + non-tree edges" basic solution (tree edges fix node potentials; non-tree edges carry 0 or cap). Each step:\n\n1. From the current spanning tree compute node potentials π (making tree edges\' reduced cost = 0).\n2. Find a non-tree edge with reduced cost < 0 as the "entering" edge e_enter.\n3. Adding e_enter forms a cycle; some tree edge on the cycle is opposed and will be canceled; the one that first hits 0 or cap is the "leaving" edge e_leave.\n4. Replace e_leave with e_enter, updating the tree.\n5. Repeat until all non-tree edges have reduced cost >= 0 (optimal).\n\nExtremely fast in practice; worst-case polynomial bound not proved, but near-linear on average.',
  },
  tags: ['network', 'min-cost-flow', 'simplex', 'spanning-tree'],
  complexity: { time: 'O(V·E) 期望', space: 'O(V + E)' },
  references: [
    { label: 'Network simplex — Wikipedia', url: 'https://en.wikipedia.org/wiki/Network_simplex' },
  ],
};
