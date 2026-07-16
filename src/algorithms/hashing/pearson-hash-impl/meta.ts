// Pearson 哈希 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'pearson-hash-impl',
  categoryId: 'hashing',
  title: { zh: 'Pearson 哈希', en: 'Pearson Hash' },
  summary: {
    zh: '用一张 256 字节置换表逐字节查表+异或，得到任意位宽哈希。',
    en: 'Per-byte table lookup + XOR over a 256-byte permutation yields any-width hash.',
  },
  description: {
    zh: 'Pearson 哈希由 Peter K. Pearson 于 1990 年提出，是一种极简单、可产生任意位宽（通常 8/16/32 位）哈希的算法。核心是一张长度恰为 256 的置换表 T（0..255 的一个随机排列）。对输入的每个字节 b，做：h = T[h XOR b]，其中 h 初始为 0（或种子）。逐字节迭代后得到的 h 即为 8 位哈希。要产生 8k 位哈希，只需对同一输入用 k 个不同的初值（如 0,1,...,k-1）或对置换表做不同旋转，运行 k 次得到 k 个 8 位拼接而成。优点：实现极短、查表无乘法、对短输入分布仍均匀、易于 8 位微控制器实现；缺点：安全性弱，置换表一旦泄露即可构造碰撞。',
    en: 'Pearson hash, introduced by Peter K. Pearson in 1990, is an extremely simple algorithm that can produce hashes of any width (commonly 8/16/32 bits). Its core is a permutation table T of length exactly 256 (a random permutation of 0..255). For each input byte b it computes h = T[h XOR b], starting with h = 0 (or a seed). The final h after all bytes is the 8-bit hash. To produce an 8k-bit hash, run the same input k times with different initial values (e.g. 0..k-1) or differently rotated tables and concatenate the k bytes. Pros: tiny implementation, table lookups instead of multiplications, uniform distribution even for short inputs, ideal for 8-bit microcontrollers. Cons: weak security — once the table leaks, collisions are easy to construct.',
  },
  tags: ['hashing', 'non-cryptographic', 'lookup-table'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
