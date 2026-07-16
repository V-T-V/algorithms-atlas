import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ds-mono-stack-2',
  categoryId: 'ds',
  title: { zh: '单调栈', en: 'Monotone Stack' },
  summary: {
    zh: '维护单调性的栈，求每个元素左/右首个更大/更小元素。',
    en: 'Stack preserving monotonicity; finds the nearest greater/smaller element for each item.',
  },
  description: {
    zh: '从左到右扫描，弹栈直到栈顶满足单调性；弹栈时即得到「右首个更优」。',
    en: 'Scan left to right, popping until the top satisfies monotonicity; each pop gives the "next better" relation.',
  },
  tags: ['ds', 'stack', 'monotone'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
