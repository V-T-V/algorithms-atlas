// 外观数列（Look-and-Say Sequence）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'misc-look-and-say',
  categoryId: 'misc',
  title: { zh: '外观数列', en: 'Look-and-Say Sequence' },
  summary: {
    zh: '读出上一项的数字：连续相同数字用"个数+数字"描述，如 1->11->21->1211。',
    en: 'Describe the previous term: runs become "count+digit", e.g. 1->11->21->1211.',
  },
  description: {
    zh: '外观数列：每项 = 上一项中连续相同数字的 (个数, 数字) 拼接。Conway 分析其增长率 ≈ 1.3035。',
    en: 'Look-and-say: each term = concatenation of (count, digit) of runs in the previous. Conway ratio ~1.3035.',
  },
  tags: ['misc', 'sequence'],
  complexity: { time: 'O(L)', space: 'O(L)' },
};
