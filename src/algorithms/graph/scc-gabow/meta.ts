import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'scc-gabow',
  categoryId: 'graph',
  title: { zh: 'Gabow 强连通', en: 'Gabow SCC' },
  summary: {
    zh: '单遍 DFS 配双栈（path 与 boundary）求强连通分量。',
    en: 'Single-pass DFS with two stacks (path + boundary) for SCC.',
  },
  description: {
    zh: 'Gabow 算法在一次 DFS 中维护 dfn(序号) 和两个栈：path 栈 S 保存当前 DFS 路径，boundary 栈 B 保存已发现 SCC 的「根」序号。遇到回边 u→v 时把 B 栈顶大于 id[v] 的元素弹出，从而保留代表 SCC 根的边界；回溯到某节点若其序号等于 B 栈顶，则弹出 B 一次，并把 S 弹到该节点即得一个 SCC。时间 O(V+E)。',
    en: 'Gabow runs a single DFS maintaining a dfn id and two stacks: path stack S (current DFS path) and boundary stack B (candidate SCC-root ids). On a back edge u->v, pop B while its top exceeds id[v]; when backtracking and a node id equals the top of B, pop B once and pop S down to that node to form one SCC. Time O(V+E).',
  },
  tags: ['graph', 'scc', 'dfs', 'strongly-connected'],
  complexity: { time: 'O(V+E)', space: 'O(V+E)' },
};
