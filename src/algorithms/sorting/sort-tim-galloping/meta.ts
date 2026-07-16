// TimSort 式（带加速归并） · 元数据
import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'sort-tim-galloping',
  categoryId: 'sorting',
  title: { zh: 'TimSort 式（带加速归并）', en: 'TimSort-style (Galloping Merge)' },
  summary: {
    zh: '归并时用二分/加速模式跳过连续取自同一侧的长段，减少比较。',
    en: 'Merge using galloping/binary search to skip long runs taken from one side, cutting comparisons.',
  },
  description: {
    zh: '本算法是 TimSort 风格的归并优化演示：当一侧连续贡献多个元素（达到阈值）时，改用二分查找（galloping）快速定位另一侧下一个该插入的位置，跳过逐个比较。对部分有序的输入可显著减少比较次数。本实现简化为：标准归并 + 连续计数触发 gallop（指数+二分）。平均 O(n log n)，最坏仍 O(n log n) 但常数更小。稳定。',
    en: 'This is a TimSort-style merge-optimization demo: when one side contributes several elements in a row (reaching a threshold), switch to binary/galloping search to find the next insertion position on the other side, skipping element-by-element comparison. This substantially cuts comparisons on partially-ordered input. Implemented as: standard merge + a consecutive-count trigger for galloping (exponential + binary). Average O(n log n), worst still O(n log n) but with a smaller constant. Stable.',
  },
  tags: ['sorting', 'comparison', 'stable', 'merge', 'adaptive'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
};
