// 模逆元 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'modular-inverse-misc',
  categoryId: 'misc',
  title: { zh: '模逆元', en: 'Modular Inverse' },
  summary: {
    zh: '求 x 使 a·x ≡ 1 (mod m)，当且仅当 GCD(a,m)=1 时存在；用扩展欧几里得。',
    en: 'Find x with a·x ≡ 1 (mod m); exists iff GCD(a,m)=1; via the extended Euclidean algorithm.',
  },
  description: {
    zh: '模逆元（modular multiplicative inverse）：给定整数 a 与正整数 m，求整数 x 使 a·x ≡ 1 (mod m)。该 x 当且仅当 a 与 m 互质（GCD(a,m)=1）时存在且在模 m 下唯一（取最小非负代表）。求法：用扩展欧几里得算法求 Bézout 系数 a·s + m·t = 1，则 s (mod m) 即为 a 的逆元。也可用费马小定理：当 m 为素数且 a 不被 m 整除时，a^(m−2) ≡ a^(−1) (mod m)，用快速幂 O(log m) 求解。模逆元是模意义下「除法」的基础：a/b mod m = a · b^(−1) mod m。广泛用于组合数取模（除以阶乘）、RSA 解密（d = e^(−1) mod φ(n)）、椭圆曲线密码等。本实现展示扩展欧几里得求逆的过程。',
    en: 'The modular multiplicative inverse: given an integer a and a positive modulus m, find an integer x such that a·x ≡ 1 (mod m). This x exists if and only if a and m are coprime (GCD(a,m)=1) and is unique modulo m (taking the least non-negative representative). Method: use the extended Euclidean algorithm to find the Bézout coefficients a·s + m·t = 1; then s (mod m) is the inverse of a. Alternatively, by Fermat\'s little theorem, when m is prime and does not divide a, a^(m−2) ≡ a^(−1) (mod m), computable in O(log m) by fast exponentiation. The modular inverse underlies "division" in modular arithmetic: a/b mod m = a · b^(−1) mod m. It is widely used in modular combinatorics (dividing by a factorial), RSA decryption (d = e^(−1) mod φ(n)), and elliptic-curve cryptography. This implementation visualises the extended-Euclidean inverse computation.',
  },
  tags: ['misc', 'number-theory', 'modular-arithmetic', 'inverse'],
  complexity: { time: 'O(log m)', space: 'O(1)' },
};
