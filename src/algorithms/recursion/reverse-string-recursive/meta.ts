// 递归反转字符串 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'reverse-string-recursive',
  categoryId: 'recursion',
  title: { zh: '递归反转字符串', en: 'Recursive String Reversal' },
  summary: {
    zh: 'lastChar + reverse(前缀)，或首尾对调；递归深度 O(n)。',
    en: 'lastChar + reverse(prefix), or swap ends; recursion depth O(n).',
  },
  description: {
    zh: '递归地反转字符串：把问题分解为「最后一个字符 + 反转剩余前缀」。每层规模减一，基例是空串返回自身。\n\n- reverse(s) = s 为空 → 空串\n- 否则：reverse(s.slice(1)) + s[0]\n\n也可以用「对调首尾 + 反转中段」的双指针递归写法，深度仍是 O(n)。这里采用首字符追加到末尾的简洁形态。',
    en: 'Recursively reverse a string by reducing to "last char + reverse the rest". Each level shrinks by one; the base case is the empty string.\n\n- reverse(s) = empty → empty string\n- else: reverse(s.slice(1)) + s[0]\n\nA two-pointer "swap ends + reverse middle" recursion also works, same O(n) depth. Here we use the concise "move first char to the end" form.',
  },
  tags: ['recursion', 'string'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
