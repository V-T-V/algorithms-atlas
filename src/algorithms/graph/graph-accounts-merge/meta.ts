import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'graph-accounts-merge',
  categoryId: 'graph',
  title: { zh: '账户合并', en: 'Accounts Merge' },
  summary: {
    zh: '同一邮箱视为同人，合并所有同邮箱账户。',
    en: 'Treat accounts sharing an email as one person; merge them.',
  },
  description: {
    zh: 'LeetCode 721。账户列表 accounts[i] = [name, email1, email2, ...]。若两个账户共享至少一个邮箱，视为同一人。返回合并后的账户：每个连通分量一个账户（名字取代表名，邮箱排序去重）。用并查集：每个邮箱映射到首次出现的账户索引，同一账户内相邻邮箱 union；最后按根聚合邮箱集合。时间 O(Σ·α)，空间 O(邮箱数)。',
    en: 'LeetCode 721. accounts[i]=[name, emails...]; accounts sharing any email are one person. Merge connected components via union-find: union adjacent emails within each account, group by root. Time O(Σ·α), space O(emails).',
  },
  tags: ['union-find', 'graph', 'leetcode'],
  complexity: { time: 'O(Σk·α)', space: 'O(Σk)' },
};
