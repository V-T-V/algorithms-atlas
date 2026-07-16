// Rabin 指纹（多项式哈希）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rabin-fingerprint-impl',
  categoryId: 'hashing',
  title: { zh: 'Rabin 指纹（多项式哈希）', en: 'Rabin Fingerprint (Polynomial Hash)' },
  summary: {
    zh: '把字节串视为大整数的系数，在模 P 下做多项式求值，得到滚动指纹。',
    en: 'Treat bytes as coefficients of a polynomial, evaluate mod P for a rolling fingerprint.',
  },
  description: {
    zh: 'Rabin 指纹由 Michael O. Rabin 与 Richard Karp 提出（1987），是字符串匹配 Rabin-Karp 算法的核心。它将一个字节串 s[0..n-1] 视为基数为 base（如 256）的多项式系数：H(s) = s[0]*base^(n-1) + s[1]*base^(n-2) + ... + s[n-1] (mod P)，其中 P 是一个大素数。可在 O(1) 时间内「滚动」：删去最高位、左移一位、加入新最低位，即 H(s[i+1..i+n]) = ((H - s[i]*base^(n-1)) * base + s[i+n]) mod P。所有运算在模 P 下进行以避免溢出。匹配时若两指纹相等，再逐字节校验以防哈希碰撞。该指纹具备代数性质：可证明两个不同串碰撞的概率 ≤ n/P，故选足够大素数即可。它是滑动窗口、去重、内容寻址存储的基石。',
    en: 'The Rabin fingerprint, proposed by Michael O. Rabin and Richard Karp (1987), is the core of the Rabin-Karp string-matching algorithm. It treats a byte string s[0..n-1] as the coefficients of a polynomial in base b (e.g. 256): H(s) = s[0]*b^(n-1) + s[1]*b^(n-2) + ... + s[n-1] (mod P), where P is a large prime. It can "roll" in O(1): drop the highest digit, shift left by one, then add the new lowest digit: H(s[i+1..i+n]) = ((H - s[i]*b^(n-1)) * b + s[i+n]) mod P. All arithmetic is mod P to prevent overflow. On a hash match one verifies byte-by-byte to rule out collisions. The fingerprint has an algebraic guarantee: collision probability of two distinct strings is ≤ n/P, so a large enough P suffices. It underpins sliding windows, deduplication, and content-addressable storage.',
  },
  tags: ['hashing', 'rolling-hash', 'polynomial', 'modular-arithmetic'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
