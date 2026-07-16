// 希尔排序（Knuth 间隔） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-shell-knuth',
  categoryId: 'sorting',
  title: { zh: '希尔排序（Knuth 间隔）', en: 'Shell Sort (Knuth Gaps)' },
  summary: {
    zh: '使用 Knuth 经典间隔序列 (...,109,41,15,5,1) 的希尔排序。',
    en: 'Shell sort with the classic Knuth gap sequence (...,109,41,15,5,1).',
  },
  description: {
    zh: '希尔排序的间隔序列决定性能。Knuth 提出的经典序列为 h_{k+1} = 3*h_k + 1，即 1, 4, 13, 40, 121, 364...（或反向 1,5,15,41,121 取 3k+1 递减）。本实现用 h = (3^k - 1)/2 形式从最大不超过 n 的间隔开始递减到 1。最坏 O(n^1.5)，对中等规模数据实用。不稳定，原地。',
    en: 'The gap sequence dominates shell sort performance. Knuth proposed the classic sequence h_{k+1} = 3*h_k + 1, i.e. 1,4,13,40,121,364... This implementation uses h = (3^k-1)/2, starting from the largest gap not exceeding n down to 1. Worst case O(n^1.5); practical for medium-sized data. Unstable, in-place.',
  },
  tags: ['sorting', 'comparison', 'in-place', 'shell'],
  complexity: { time: 'O(n^1.5)', space: 'O(1)' },
};
