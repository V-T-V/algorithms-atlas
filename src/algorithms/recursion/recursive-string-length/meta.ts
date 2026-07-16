// 递归求字符串长度（不用 .length）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'recursive-string-length',
  categoryId: 'recursion',
  title: { zh: '递归求字符串长度', en: 'Recursive String Length' },
  summary: {
    zh: '不用 .length，靠 1 + length(slice(1)) 递归数清字符数。',
    en: 'Count characters without .length via 1 + length(slice(1)).',
  },
  description: {
    zh: '教学版递归求字符串长度（禁用 .length）：\n- 基线：字符串为空 → 返回 0\n- 递归：1 + length(s.slice(1))\n\n每层「砍掉」首字符，递归深度 = 字符串长度。时间 O(n^2)（因 slice 每层 O(n)），空间 O(n)。',
    en: 'Pedagogical recursive string length (no .length): empty returns 0; otherwise 1 + length(s.slice(1)). Each layer drops the first character; depth = string length. O(n^2) time due to slicing, O(n) space.',
  },
  tags: ['recursion', 'string', 'length', 'teaching'],
  complexity: { time: 'O(n^2)', space: 'O(n)' },
};
