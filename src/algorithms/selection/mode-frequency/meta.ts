// 主元素 / 多数元素（Boyer-Moore 投票）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'mode-frequency',
  categoryId: 'selection',
  title: { zh: '主元素（Boyer-Moore 投票）', en: 'Majority Element (Boyer-Moore)' },
  summary: {
    zh: '用 O(1) 空间投票法找出现超过 n/2 次的主元素。',
    en: 'Find an element appearing more than n/2 times in O(1) extra space.',
  },
  description: {
    zh: 'Boyer-Moore 多数投票算法：维护 candidate 和 count。\n\n- 遍历每个元素 x：\n  - 若 count === 0，令 candidate = x，count = 1；\n  - 否则若 x === candidate，count++；否则 count--。\n- 由于主元素出现超过 n/2 次，它最终不会被抵消光，candidate 即为主元素。\n\n若题目保证存在主元素，可直接返回 candidate；若不保证，需再扫一遍统计频次验证。\n\n时间 `O(n)`，空间 `O(1)`。',
    en: 'Boyer-Moore majority vote: keep a candidate and a count.\n\n- For each element x:\n  - If count === 0, set candidate = x, count = 1;\n  - Else if x === candidate, count++; else count--.\n- A majority (>n/2) survives all cancellations, so candidate is it.\n\nIf majority existence is guaranteed, return candidate directly; otherwise do a second pass to verify frequency.\n\nTime `O(n)`, space `O(1)`.',
  },
  tags: ['voting', 'greedy', 'frequency'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
