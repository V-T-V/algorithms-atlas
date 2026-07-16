// 在线页面置换（Online Paging Algorithm）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'greedy-online-paging',
  categoryId: 'greedy',
  title: { zh: '在线页面置换', en: 'Online Paging Algorithm' },
  summary: {
    zh: '缓存满时按 LRU/FIFO 贪心淘汰，分析竞争比。',
    en: 'When cache is full evict by LRU/FIFO greedily; analyze competitive ratio.',
  },
  description: {
    zh: '在线分页：固定大小缓存，访问序列到达。LRU 淘汰最久未用页。Sleator-Tarjan：k-页 LRU 是 k+1 竞争。',
    en: 'Online paging: fixed-size cache, request stream. LRU evicts least-recently-used. Sleator-Tarjan: k-LRU is k+1-competitive.',
  },
  tags: ['greedy', 'online-algorithm', 'caching'],
  complexity: { time: 'O(n·k)', space: 'O(k)' },
};
