// 最大异或值 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bitwise-max-xor',
  categoryId: 'bitwise',
  title: { zh: '最大异或值', en: 'Maximum XOR' },
  summary: {
    zh: '用「前缀集合 + 贪心」逐位构造，求数组中两元素最大异或（LeetCode 421）。',
    en: 'Greedy bit-by-bit construction via a prefix set; find max XOR of two array elements (LeetCode 421).',
  },
  description: {
    zh:
      '最大异或值（Maximum XOR of Two Numbers，LeetCode 421）：在数组中选两元素使其异或最大。' +
      '\n用「前缀集合 + 贪心」逐位从高到低构造答案：' +
      '\n- 假设当前已知最大异或的高位前缀为 `ans`，尝试把第 k 位设为 1 得 `candidate`。' +
      '\n- 把所有数的 k 位前缀放入集合 `prefixes`。' +
      '\n- 若存在 p1, p2 使 `p1 ^ p2 == candidate`（即 `prefixes` 中有 `p ^ candidate`），' +
      '则该位可置 1，更新 ans。' +
      '\n时间 `O(n·log M)`（M 为最大值），空间 `O(n)`。比朴素 `O(n²)` 快。',
    en:
      'Maximum XOR (LeetCode 421): pick two array elements with max XOR. ' +
      '\nGreedy bit-by-bit from high to low using a prefix set: ' +
      '\n- Suppose the high-bit prefix of the answer so far is `ans`; try setting bit k to get `candidate`. ' +
      "\n- Put each number's k-bit prefix into a set `prefixes`. " +
      '\n- If some p1, p2 satisfy p1 ^ p2 == candidate (i.e., `prefixes` has p ^ candidate), ' +
      'set this bit and update ans. ' +
      'Time O(n·log M) (M = max value), space O(n). Beats naive O(n²).',
  },
  tags: ['bitwise', 'xor', 'max', 'greedy', 'prefix-set'],
  complexity: { time: 'O(n·log M)', space: 'O(n)' },
};
