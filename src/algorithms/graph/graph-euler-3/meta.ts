import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-euler-3',
  categoryId: 'graph',
  title: { zh: '欧拉回路（Hierholzer）', en: 'Euler Circuit (Hierholzer)' },
  summary: {
    zh: 'Hierholzer 算法求无向图欧拉回路：当所有顶点度数均为偶数时存在。',
    en: 'Hierholzer: find an Euler circuit when every vertex has even degree.',
  },
  description: {
    zh: '从任一顶点开始 DFS，走边即删之，走到死胡同则把节点压入路径栈，最后反转得到欧拉回路。需先验证度数条件。',
    en: 'DFS from any vertex, deleting edges as used; push vertex onto path stack at dead-end; reverse the stack.',
  },
  tags: ['graph', 'euler', 'circuit'],
  complexity: { time: 'O(V+E)', space: 'O(V+E)' },
};
