// McCarthy 91 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rec-mccarthy-2',
  categoryId: 'recursion',
  title: { zh: 'McCarthy 91', en: 'McCarthy 91 Function' },
  summary: {
    zh: 'M(n) = n−10 (n>100), 否则 M(M(n+11))。对 n≤100 总返回 91。',
    en: 'M(n) = n−10 (n>100), else M(M(n+11)). Always returns 91 for n≤100.',
  },
  description: {
    zh: 'McCarthy 91 函数：递归理论反直觉经典——所有 n≤100 都映射到 91。',
    en: 'McCarthy 91 function: a counterintuitive recursion-theory classic — every n≤100 maps to 91.',
  },
  tags: ['recursion', 'theory', 'mccarthy'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
