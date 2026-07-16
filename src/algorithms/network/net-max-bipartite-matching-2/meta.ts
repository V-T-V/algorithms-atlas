// 二分匹配变种（Hopcroft-Karp）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'net-max-bipartite-matching-2',
  categoryId: 'network',
  title: { zh: '二分匹配变种（Hopcroft-Karp）', en: 'Bipartite Matching (Hopcroft-Karp)' },
  summary: {
    zh: '用 BFS 分层 + DFS 同时找多条最短增广路，O(E·√V) 求二分图最大匹配。',
    en: 'BFS layering plus DFS finds multiple shortest augmenting paths per phase, O(E·√V) max matching.',
  },
  description: {
    zh: 'Hopcroft-Karp 算法在二分图上求最大匹配：每轮用 BFS 给左侧未匹配点到所有点的最短距离分层，再用 DFS 沿分层同时找出本阶段所有最短增广路（并更新匹配）。每阶段最短增广路长度严格递增，至多 √V 个阶段。比匈牙利算法（每轮只找一条）渐近更快。',
    en: 'Hopcroft-Karp computes a maximum matching on a bipartite graph: each phase uses BFS to compute shortest-distance layers from all free left vertices, then DFS to simultaneously find all shortest augmenting paths of that phase and update the matching. Each phase strictly increases the augmenting-path length, bounding phases to √V. It is asymptotically faster than the Hungarian method (which augments one path at a time).',
  },
  tags: ['network', 'matching', 'bipartite', 'hopcroft-karp'],
  complexity: { time: 'O(E·√V)', space: 'O(V + E)' },
};
