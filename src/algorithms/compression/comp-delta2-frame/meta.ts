// 二阶差分编码（Second-Order Delta）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'comp-delta2-frame',
  categoryId: 'compression',
  title: { zh: '二阶差分编码', en: 'Second-Order Delta' },
  summary: { zh: '对差分序列再做一次差分。', en: 'Differences of differences.' },
  description: {
    zh: '二阶差分对单调递增序列(时间戳、id)做两次差分，使大多数值变小变零，利于后续 varint/熵编码。',
    en: 'Second-order delta differences a monotonically increasing sequence twice, shrinking most values for varint/entropy coding.',
  },
  tags: ['compression', 'delta', 'second-order'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
