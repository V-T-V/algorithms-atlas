// 梳排序（收缩 1.33） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-comb-133',
  categoryId: 'sorting',
  title: { zh: '梳排序（收缩 1.33）', en: 'Comb Sort (Shrink 1.33)' },
  summary: {
    zh: '用收缩因子 1.33 的梳排序，间隔序列更陡。',
    en: 'Comb sort with shrink factor 1.33; a steeper gap sequence.',
  },
  description: {
    zh: '梳排序的收缩因子影响间隔序列与性能。本实现用 1.33（比经典 1.3 略大），间隔下降更陡，趟数略少但每趟覆盖尺度跳跃更大。其余逻辑相同。不稳定，原地。平均约 O(n^1.3)，最坏 O(n^2)。',
    en: 'The shrink factor of comb sort affects the gap sequence and performance. This variant uses 1.33 (slightly larger than the classic 1.3), giving a steeper gap descent: fewer passes but larger scale jumps per pass. Otherwise identical. Unstable, in-place. Average about O(n^1.3), worst O(n^2).',
  },
  tags: ['sorting', 'comparison', 'in-place'],
  complexity: { time: 'O(n^2)', space: 'O(1)' },
};
