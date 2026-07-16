// 通知所有员工 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-time-needed',
  categoryId: 'network',
  title: { zh: '通知所有员工', en: 'Time Needed to Inform All' },
  summary: {
    zh: '树形公司层级通知，求通知所有人时间。',
    en: 'Time to inform all employees in a hierarchy tree.',
  },
  description: {
    zh: '后序 DFS：每个员工时间 = informTime + 子树最大。',
    en: 'Post-order DFS; time = informTime + max(child). O(n).',
  },
  tags: ['network', 'tree', 'dfs'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
