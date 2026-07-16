// 最小冲突（Min-Conflicts）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ais-min-conflicts',
  categoryId: 'ai-search',
  title: { zh: '最小冲突', en: 'Min-Conflicts' },
  summary: { zh: 'CSP 局部搜索：选冲突最少的值。', en: 'Local search picking min-conflict value.' },
  description: {
    zh: 'Min-Conflicts(Minton 等)是 CSP 的局部搜索：随机选一个冲突变量，改成与其约束冲突最少的值，反复至无冲突。',
    en: 'Min-Conflicts is a CSP local search: pick a conflicted variable and switch it to the value minimizing conflicts; repeat until solved.',
  },
  tags: ['ai-search', 'csp', 'local-search', 'min-conflicts'],
  complexity: { time: 'O(steps * n)', space: 'O(n)' },
};
