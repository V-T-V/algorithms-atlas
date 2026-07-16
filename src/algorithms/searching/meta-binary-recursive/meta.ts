// 元二分查找（递归版）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'meta-binary-recursive',
  categoryId: 'searching',
  title: { zh: '元二分查找（递归）', en: 'Meta Binary Search (Recursive)' },
  summary: {
    zh: '递归地逐位构建答案下标的元二分查找。',
    en: 'Recursively build the answer index bit-by-bit.',
  },
  description: {
    zh:
      '元二分查找（递归版）：与迭代版思路一致——从高位到低位确定答案下标的每一位，' +
      '\n但用递归把「处理第 bit 位」表达为递归调用。' +
      '\n- 从最高位 k 开始，尝试把当前位置加上 `2^bit` 得到候选 mid。' +
      '\n- 若 `a[mid] ≤ target`，则该位保留 1，递归处理低位。' +
      '\n- 否则该位清 0，递归处理低位。' +
      '\n最终 `pos` 指向不大于 target 的最大下标，校验是否相等。时间 `O(log n)`，空间 `O(log n)`（递归栈）。',
    en:
      'Meta Binary Search (Recursive): same idea as the iterative version — determine each bit of ' +
      'the answer index from high to low — but expressed recursively. ' +
      '\n- Starting from the top bit k, try adding 2^bit to the current position to get candidate mid. ' +
      '\n- If a[mid] ≤ target, keep this bit 1 and recurse on lower bits. ' +
      '\n- Else clear this bit and recurse. ' +
      'pos ends at the largest index with a[pos] ≤ target; verify equality. Time O(log n), space O(log n) (recursion).',
  },
  tags: ['searching', 'sorted', 'bitwise', 'recursive', 'divide-and-conquer'],
  complexity: { time: 'O(log n)', space: 'O(log n)' },
};
