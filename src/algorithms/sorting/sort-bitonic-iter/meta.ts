// 双调排序（迭代） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-bitonic-iter',
  categoryId: 'sorting',
  title: { zh: '双调排序（迭代）', en: 'Bitonic Sort (Iterative)' },
  summary: {
    zh: '迭代版双调排序网络：对每级 k 做 bitonic 归并，并行友好。',
    en: 'Iterative bitonic sorting network: for each level k do a bitonic merge; parallel-friendly.',
  },
  description: {
    zh: '双调排序（Bitonic Sort）是经典排序网络：先把序列变成双调序列（前半升后半降），再递归/迭代地用比较-交换把双调序列变成单调。所有比较-交换在同一级内相互独立，高度并行。比较次数 O(n log^2 n)。本迭代版要求长度为 2 的幂（不足用 +∞ 填充）。非自适应，适合 GPU/SIMD。',
    en: 'Bitonic sort is a classic sorting network: first turn the sequence into a bitonic one (ascending first half, descending second half), then recursively/iteratively compare-swap it into monotone order. All compare-swaps within a level are independent, highly parallel. Comparison count O(n log^2 n). This iterative version requires a power-of-2 length (padded with +Infinity). Non-adaptive; suits GPU/SIMD.',
  },
  tags: ['sorting', 'comparison', 'sorting-network', 'parallel'],
  complexity: { time: 'O(n log^2 n)', space: 'O(n)' },
};
