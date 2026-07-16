// 根到叶数字和v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'tree-sum-root-leaf-2',
  categoryId: 'tree',
  title: { zh: '根到叶数字和v2', en: 'Sum Root to Leaf Numbers v2' },
  summary: {
    zh: '每条根到叶路径构成一个数字（如 1→2 = 12），求所有数字之和。',
    en: 'Each root-to-leaf path forms a number (e.g. 1->2 = 12); sum them.',
  },
  description: {
    zh: 'DFS 维护当前累积值 cur = cur*10 + val，到叶累加。',
    en: 'DFS: cur = cur*10 + val; add at leaf. O(n).',
  },
  tags: ['tree', 'numbers', 'dfs'],
  complexity: { time: 'O(n)', space: 'O(h)' },
};
