// PFor 帧差压缩（Patched Frame of Reference）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'comp-pfor-delta',
  categoryId: 'compression',
  title: { zh: 'PFor 帧差压缩', en: 'Patched Frame of Reference' },
  summary: {
    zh: '数组用固定 b 位存+异常补丁。',
    en: 'Fixed b bits per value plus exception patches.',
  },
  description: {
    zh: 'PFor Delta(δ)把多数接近的数值用固定 b 位存储，少数异常值单独存放并以指针引用，倒排索引常用。',
    en: 'PFor Delta stores most near-equal values in fixed b bits with exceptions patched separately; common in inverted indices.',
  },
  tags: ['compression', 'pfor', 'inverted-index'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
