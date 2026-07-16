// 末尾零计数v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-trailing-zeros-2',
  categoryId: 'bitwise',
  title: { zh: '末尾零计数v2', en: 'Count Trailing Zeros v2' },
  summary: {
    zh: '折半实现 ctz：返回最低位 1 之后的 0 个数。',
    en: 'Branchless ctz via halving isolates the lowest set bit.',
  },
  description: {
    zh: '思路：先用 v & -v 分离最低位的 1（isolate），然后数其后 0 的个数。当 x=0 时约定返回 32。',
    en: 'Isolate lowbit with v & -v, then halve to count trailing zeros. x=0 → 32. O(1).',
  },
  tags: ['bitwise', 'ctz', 'lowest-set-bit'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
