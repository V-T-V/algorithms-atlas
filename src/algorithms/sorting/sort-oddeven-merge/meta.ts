// 奇偶归并排序（Batcher） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-oddeven-merge',
  categoryId: 'sorting',
  title: { zh: '奇偶归并排序（Batcher）', en: 'Odd-Even Merge Sort (Batcher)' },
  summary: {
    zh: 'Batcher 奇偶归并网络：递归归并奇/偶子序列，适合并行/硬件。',
    en: 'Batcher odd-even merge network: recursively merge odd/even subsequences; parallel/hardware-friendly.',
  },
  description: {
    zh: 'Batcher 奇偶归并排序（Odd-Even Merge Sort）基于排序网络：递归地把序列分成奇数位和偶数位两个子序列分别排序，再用奇偶归并（compare-swap a[2i] 与 a[2i+1]）合并。比较-交换操作相互独立，天然适合并行处理器或硬件实现。比较次数 O(n log^2 n)，非自适应。本实现递归版。',
    en: 'Batcher odd-even merge sort is based on sorting networks: recursively split the sequence into odd-indexed and even-indexed subsequences, sort each, then merge with odd-even compare-swaps (compare-swap a[2i], a[2i+1]). The compare-swap operations are independent, naturally suited to parallel processors or hardware. Comparison count O(n log^2 n), non-adaptive. This is the recursive version.',
  },
  tags: ['sorting', 'comparison', 'sorting-network', 'parallel', 'divide-and-conquer'],
  complexity: { time: 'O(n log^2 n)', space: 'O(n)' },
};
