import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-mwis',
  categoryId: 'graph',
  title: { zh: '树上最大权独立集', en: 'Maximum Weight Independent Set (Tree)' },
  summary: {
    zh: '树形 DP 求权值和最大的独立集（相邻不取）。',
    en: 'Tree DP for the independent set of maximum total weight (no two adjacent).',
  },
  description: {
    zh: '树上的最大权独立集（可精确多项式求解）。每个节点返回 [take, skip]：take=w[u]+Σskip[child]；skip=Σmax(take,skip)[child]。后序遍历一次得最优。时间 O(V)，空间 O(V)。注：一般图上 MWIS 是 NP-hard。',
    en: 'MWIS on a tree via DP: each node returns [take,skip]. take=w+sum child skip; skip=sum max(child take,skip). Postorder. Time O(V), space O(V). (NP-hard on general graphs.)',
  },
  tags: ['graph', 'independent-set', 'tree-dp', 'dynamic-programming'],
  complexity: { time: 'O(V)', space: 'O(V)' },
};
