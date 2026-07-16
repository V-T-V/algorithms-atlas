// 子集枚举v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-subset-enumerate-2',
  categoryId: 'bitwise',
  title: { zh: '子集枚举v2', en: 'Subset Enumeration v2' },
  summary: {
    zh: '枚举位掩码 mask 的所有非空子集（Gosper 技巧）。',
    en: 'Enumerate all non-empty subsets of a bitmask via the Gosper trick.',
  },
  description: {
    zh: 'sub = (sub - 1) & mask 依降序遍历所有子集，直到 0。',
    en: 'sub = (sub-1) & mask iterates all subsets in descending order. O(2^k).',
  },
  tags: ['bitwise', 'subset', 'gosper'],
  complexity: { time: 'O(2^k)', space: 'O(1)' },
};
