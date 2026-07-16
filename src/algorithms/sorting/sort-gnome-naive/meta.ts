// 侏儒排序（朴素） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-gnome-naive',
  categoryId: 'sorting',
  title: { zh: '侏儒排序（朴素）', en: 'Gnome Sort (Naive)' },
  summary: {
    zh: '经典侏儒排序：逐位前进，遇逆序则交换并后退一位。',
    en: 'Classic gnome sort: step forward; on an inversion swap and step back one.',
  },
  description: {
    zh: '侏儒排序（Gnome Sort / Stupid Sort）的朴素版：维护游标 i 从 1 开始，若 a[i-1]<=a[i] 则前进，否则交换并后退一位（i--）。像花园侏儒逐盆检查花盆顺序。最坏 O(n^2)，对几乎有序输入接近 O(n)。代码极短。稳定，原地。',
    en: 'Naive gnome sort (stupid sort): keep a cursor i starting at 1; if a[i-1]<=a[i] advance, else swap and step back (i--). Like a garden gnome checking pots in order. Worst O(n^2), near O(n) on nearly-sorted input. Tiny code. Stable, in-place.',
  },
  tags: ['sorting', 'comparison', 'stable', 'in-place', 'educational'],
  complexity: { time: 'O(n^2)', space: 'O(1)' },
};
