// 锦标赛屏障（Tournament Barrier）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'conc-tournament-barrier',
  categoryId: 'concurrency',
  title: { zh: '锦标赛屏障', en: 'Tournament Barrier' },
  summary: { zh: '二叉树两两汇合的屏障。', en: 'Binary-tree pairwise barrier.' },
  description: {
    zh: '锦标赛屏障把 n 个线程组织成二叉树，每轮两两汇合胜者上升，根节点反转广播，消息复杂度 O(n)。',
    en: 'Tournament barrier arranges n threads in a binary tree, pairwise arriving each round up to the root then broadcasting back down.',
  },
  tags: ['concurrency', 'barrier', 'tournament'],
  complexity: { time: 'O(log n)', space: 'O(n)' },
};
