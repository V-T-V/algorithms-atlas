// 随机化哈密顿路径判定 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'randomized-hamiltonian',
  categoryId: 'randomized',
  title: { zh: '随机化哈密顿路径判定', en: 'Randomized Hamiltonian Path' },
  summary: {
    zh: '随机打乱顶点序，贪心交换相邻冲突；多次重启找到经过每个顶点恰一次的路径。',
    en: 'Randomly permute vertices and greedily swap adjacent conflicts; multiple restarts find a path visiting each vertex exactly once.',
  },
  description: {
    zh: '哈密顿路径（Hamiltonian Path）问题：判定图中是否存在一条经过每个顶点恰一次的简单路径，是经典 NP 完全问题。本实现演示一种实用的随机化启发式（带局部搜索）作为 Las Vegas 风格搜索：(1) 随机生成顶点的一个排列 P；(2) 检查 P 是否构成合法路径（即 P[i]→P[i+1] 是图中的边对所有 i 成立）；(3) 若不合法，对相邻的「断边」位置做随机交换，或完全重启一个新的随机排列。重复 R 次重启、每次最多 S 步局部修正。若找到合法排列则返回该路径；若所有尝试都失败，则报告「未找到」（不等于一定不存在）。对于稠密图或已知含哈密顿路径的图，该方法常能快速命中。确定性回溯可作为对比基准。',
    en: "The Hamiltonian Path problem — deciding whether a graph has a simple path visiting every vertex exactly once — is a classic NP-complete problem. This implementation demonstrates a practical randomized heuristic (with local search) as a Las Vegas style search: (1) generate a random permutation P of vertices; (2) check whether P forms a legal path (i.e. P[i]→P[i+1] is an edge for all i); (3) if not, randomly swap at adjacent 'broken-edge' positions, or restart with a fresh random permutation. Repeat R restarts with at most S local-repair steps each. If a legal permutation is found it is returned; if all attempts fail, report 'not found' (which does not prove absence). For dense graphs or graphs known to contain a Hamiltonian path, the method often succeeds quickly. Deterministic backtracking can serve as a baseline.",
  },
  tags: ['randomized', 'graph', 'hamiltonian', 'np-complete', 'heuristic', 'las-vegas'],
  complexity: { time: 'O(R·S·n)', space: 'O(n²)' },
};
