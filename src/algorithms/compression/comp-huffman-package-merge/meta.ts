// Package-Merge 最优长度受限哈夫曼（Package-Merge Huffman）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'comp-huffman-package-merge',
  categoryId: 'compression',
  title: { zh: 'Package-Merge 最优长度受限哈夫曼', en: 'Package-Merge Huffman' },
  summary: { zh: '在最大码长约束下构造最优前缀码。', en: 'Optimal length-limited prefix codes.' },
  description: {
    zh: 'Package-Merge(Larmore-Hirschberg)在码长不超过 L 的约束下求最优前缀码长度分配，比朴素哈夫曼更适合超长约束场景。',
    en: 'Package-Merge (Larmore-Hirschberg) finds optimal code lengths under a max-length cap L, beyond naive Huffman.',
  },
  tags: ['compression', 'huffman', 'length-limited'],
  complexity: { time: 'O(nL)', space: 'O(nL)' },
};
