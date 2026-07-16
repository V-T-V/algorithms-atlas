// 同时找最小和最大（分治法）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'min-max-select',
  categoryId: 'selection',
  title: { zh: '同时找最小与最大（分治）', en: 'Min and Max Together (Divide & Conquer)' },
  summary: {
    zh: '成对比较法只需 ⌈3n/2⌉−2 次比较，优于分两次线性扫描。',
    en: 'Pairing method needs only ⌈3n/2⌉−2 comparisons, beating two linear scans.',
  },
  description: {
    zh: '朴素找最小和最大各扫一遍需 2(n−1) 次比较。成对比较法把元素两两配对：每对先内部比较一次（得小者和大者），再把小者与全局最小比、大者与全局最大比，每对共 3 次比较。\n\n- n 为偶数：n/2 对 × 3 = 3n/2 次\n- n 为奇数：第一元素作初值，余下 (n−1)/2 对 × 3 = ⌈3n/2⌉−2 次\n\n这是比较模型下同时找 min/max 的最优常数。',
    en: 'Naively scanning for min then max costs 2(n−1) comparisons. Pairing elements: within each pair compare once (smaller/larger), then compare the smaller to the running min and the larger to the running max — 3 comparisons per pair. Total ⌈3n/2⌉−2. Optimal in the comparison model.',
  },
  tags: ['selection', 'min-max', 'comparison-model', 'optimal'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
