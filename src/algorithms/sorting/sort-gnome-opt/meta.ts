// 侏儒排序（跳回优化） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-gnome-opt',
  categoryId: 'sorting',
  title: { zh: '侏儒排序（跳回优化）', en: 'Gnome Sort (Jump-Back Optimized)' },
  summary: {
    zh: '经典侏儒排序加跳跃回退：交换后跳回上次位置而非逐位回退。',
    en: 'Optimized gnome sort jumps back to the previous position after a swap instead of stepping one by one.',
  },
  description: {
    zh: '侏儒排序（Gnome Sort / Stupid Sort）像花园侏儒一样逐位向右走：若当前对有序则前进，否则交换并后退。朴素版本后退一位，本优化版记录上次前进到的最远位置 pos，交换后直接跳回 pos（而非 i-1），避免重复扫描已排序段。平均复杂度仍为 O(n^2)，但对几乎有序数组接近 O(n)。稳定，原地。',
    en: 'Gnome sort walks right like a garden gnome: advance if the pair is ordered, else swap and step back. The naive version steps back one; this optimized variant remembers the furthest position reached and jumps back there after a swap, skipping re-scans of the sorted prefix. Still O(n^2) average but ~O(n) on nearly-sorted input. Stable, in-place.',
  },
  tags: ['sorting', 'comparison', 'stable', 'in-place'],
  complexity: { time: 'O(n^2)', space: 'O(1)' },
};
