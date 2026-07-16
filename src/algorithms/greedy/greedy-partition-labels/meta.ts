// 划分字母区间 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'greedy-partition-labels',
  categoryId: 'greedy',
  title: { zh: '划分字母区间', en: 'Partition Labels' },
  summary: {
    zh: '把字符串分成尽量多段，使每个字母只出现在一段里。',
    en: 'Split a string into as many parts as possible so each letter appears in only one part.',
  },
  description: {
    zh: '先记录每个字母最后位置，再线性扫描：当前段右端 = 已见字母最远位置；i 到达 right 即可切分。',
    en: 'Record each letter last index, then scan: current right end = furthest of seen letters; cut when i reaches right.',
  },
  tags: ['greedy', 'string', 'two-pointers'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
