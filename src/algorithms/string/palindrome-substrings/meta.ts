// Palindrome Substrings · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'palindrome-substrings',
  categoryId: 'string',
  title: { zh: '回文子串计数', en: 'Palindromic Substrings' },
  summary: {
    zh: '用中心扩展法统计所有回文子串个数，O(n²) 时间 O(1) 空间。',
    en: 'Counts all palindromic substrings via center expansion in O(n²) time, O(1) space.',
  },
  description: {
    zh: '回文子串计数（Palindromic Substrings）：统计字符串 s 中所有「回文子串」的个数（不同位置/长度的子串分别计数）。例如 "abc" 有 3 个（"a","b","c"），"aaa" 有 6 个（"a","a","a","aa","aa","aaa"）。\n\n用**中心扩展法**：每个回文以某个中心（单字符 = 奇数长度中心，或两字符间隙 = 偶数长度中心）对称向外扩展，每扩展成功即发现一个新回文。共 2n-1 个中心，每次扩展至多 O(n)，总体 O(n²)，空间 O(1)。也可用 Manacher 在 O(n) 完成，但中心扩展更直观。',
    en: 'Palindromic Substrings counts all palindromic substrings of s (distinct by position/length). E.g. "abc" has 3 ("a","b","c"); "aaa" has 6 ("a","a","a","aa","aa","aaa").\n\nUsing **center expansion**: every palindrome radiates from a center (a single char = odd-length center, or the gap between two chars = even-length center). There are 2n-1 centers, each expanding up to O(n), giving O(n²) overall, space O(1). Manacher can do O(n) but center expansion is more intuitive.',
  },
  tags: ['string', 'palindrome', 'center-expansion', 'counting'],
  complexity: { time: 'O(n²)', space: 'O(1)' },
};
