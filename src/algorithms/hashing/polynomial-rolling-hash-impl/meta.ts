// 多项式滚动哈希 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'polynomial-rolling-hash-impl',
  categoryId: 'hashing',
  title: { zh: '多项式滚动哈希', en: 'Polynomial Rolling Hash' },
  summary: {
    zh: '竞赛常用：H = Σ s[i]·base^(n-1-i) mod P，窗口可在 O(1) 内向右滚动一位。',
    en: 'Contest staple: H = Σ s[i]·base^(n-1-i) mod P; a window rolls right one step in O(1).',
  },
  description: {
    zh: '多项式滚动哈希是字符串算法（子串相等判定、最长回文、Rabin-Karp 匹配、内容寻址）的核心工具。它把长度为 n 的字符串视为以 base 为基的多项式，系数为各字符编码：H(s) = (Σ_{i=0}^{n-1} s[i]·base^(n-1-i)) mod P。常用 base 取 91138233、131 等与素数 P（如 10^9+7、10^9+9）搭配。关键性质是「可滚动」：已知窗口 [i, i+w) 的指纹，向右滑动一位到 [i+1, i+1+w) 只需 O(1)：newH = ((H − s[i]·base^(w−1)) · base + s[i+w]) mod P。预处理 base 的幂和前缀哈希后，可在 O(1) 内求任意子串 [l, r) 的指纹：H(l,r) = (pref[r] − pref[l]·base^(r−l)) mod P。这是字符串哈希、双哈希、子串去重的基础。',
    en: 'The polynomial rolling hash is the workhorse of string algorithms (substring equality, longest palindrome, Rabin-Karp matching, content addressing). It treats a length-n string as a polynomial in base b whose coefficients are the character codes: H(s) = (Σ_{i=0}^{n-1} s[i]·b^(n-1-i)) mod P. Common bases are 91138233 or 131 paired with a prime P (e.g. 10^9+7, 10^9+9). The key property is "rollability": given the fingerprint of window [i, i+w), sliding one step right to [i+1, i+1+w) costs O(1): newH = ((H − s[i]·b^(w−1)) · b + s[i+w]) mod P. After precomputing powers of b and prefix hashes, any substring [l, r) has fingerprint H(l,r) = (pref[r] − pref[l]·b^(r−l)) mod P in O(1). This underpins string hashing, double hashing, and substring deduplication.',
  },
  tags: ['hashing', 'rolling-hash', 'polynomial', 'modular-arithmetic'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
