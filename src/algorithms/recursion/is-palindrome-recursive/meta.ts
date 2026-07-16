// 递归回文判定 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'is-palindrome-recursive',
  categoryId: 'recursion',
  title: { zh: '递归回文判定', en: 'Recursive Palindrome Check' },
  summary: {
    zh: '比较首尾字符后递归判定中段，lo ≥ hi 时为真。',
    en: 'Compare end chars then recurse on the middle; true when lo >= hi.',
  },
  description: {
    zh: '递归地从两端向中间收缩：若 s[lo] != s[hi] 则非回文；若 lo >= hi 则是回文；否则递归判定 [lo+1, hi-1]。\n\n- 基例：lo >= hi → true（0 或 1 个字符必回文）\n- 递归：s[lo] === s[hi] 且 isPal(lo+1, hi-1)\n\n递归深度 O(n/2)，比 misc 里的迭代版本更能体现「双端逼近」的递归结构。',
    en: 'Recursively shrink from both ends: if s[lo] != s[hi] not a palindrome; if lo >= hi it is; else recurse on [lo+1, hi-1].\n\n- Base: lo >= hi → true (0 or 1 chars are palindromes)\n- Recurse: s[lo] === s[hi] and isPal(lo+1, hi-1)\n\nRecursion depth O(n/2); compared to the iterative version in misc, it shows the recursive "two-end approach" structure.',
  },
  tags: ['recursion', 'string'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
