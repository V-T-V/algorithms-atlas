// Stooge 排序（三段递归） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-stooge-2',
  categoryId: 'sorting',
  title: { zh: 'Stooge 排序（三段递归）', en: 'Stooge Sort (3-Segment Recursion)' },
  summary: {
    zh: '经典 Stooge：递归排序前 2/3、后 2/3、再前 2/3，教学用极慢排序。',
    en: 'Classic stooge: recursively sort the first 2/3, then last 2/3, then first 2/3 again; a pedagogically slow sort.',
  },
  description: {
    zh: 'Stooge 排序是著名的教学用「低效排序」：对长度 > 2 的数组，先比较首尾必要时交换，然后递归排序前 2/3、后 2/3、再前 2/3。时间复杂度约 O(n^(log1.5 3)) ≈ O(n^2.71)，极慢但代码极短。本实现即经典版本。稳定与否取决于交换实现，本版不稳定。仅供教学对比。',
    en: "Stooge sort is a famous pedagogical 'inefficient sort': for length > 2, compare (and swap) the ends, then recursively sort the first 2/3, the last 2/3, and the first 2/3 again. Time is about O(n^(log1.5 3)) ~ O(n^2.71), very slow but the code is tiny. This is the classic version. Unstable. For teaching only.",
  },
  tags: ['sorting', 'comparison', 'recursive', 'educational'],
  complexity: { time: 'O(n^2.71)', space: 'O(n)' },
};
