// 梳排序（收缩 1.25） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-comb-125',
  categoryId: 'sorting',
  title: { zh: '梳排序（收缩 1.25）', en: 'Comb Sort (Shrink 1.25)' },
  summary: {
    zh: '单一收缩因子 1.25 的梳排序，间隔序列略密。',
    en: 'Comb sort with a single shrink factor of 1.25; a denser gap sequence.',
  },
  description: {
    zh: '梳排序用收缩因子 1.3 是经典选择，本实现改用 1.25，使间隔序列更密集（gap 减小更快），在中等规模数组上可能略快收敛。其余逻辑相同：gap 从 n 起，每趟 gap = floor(gap/1.25)，比较相距 gap 的元素并交换，直到 gap=1 且无交换。不稳定，原地。最坏 O(n^2)，平均约 O(n^1.3)。',
    en: "Comb sort's classic shrink factor is 1.3; this variant uses 1.25 for a denser gap sequence (gaps shrink faster), which can converge slightly faster on medium arrays. Otherwise identical: gap starts at n, each pass sets gap = floor(gap/1.25), compares and swaps elements gap apart, until gap=1 with no swaps. Unstable, in-place. Worst O(n^2), average about O(n^1.3).",
  },
  tags: ['sorting', 'comparison', 'in-place'],
  complexity: { time: 'O(n^2)', space: 'O(1)' },
};
