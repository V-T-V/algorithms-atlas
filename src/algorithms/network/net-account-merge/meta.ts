// 账户合并 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-account-merge',
  categoryId: 'network',
  title: { zh: '账户合并', en: 'Accounts Merge' },
  summary: {
    zh: '用并查集合并共享邮箱的账户。',
    en: 'Merge accounts sharing emails via union-find.',
  },
  description: {
    zh: '邮箱作节点，同账户的邮箱 union，再分组。',
    en: 'Union-find on emails. O(N*K α).',
  },
  tags: ['network', 'graph', 'union-find'],
  complexity: { time: 'O(N*K α)', space: 'O(N*K)' },
};
