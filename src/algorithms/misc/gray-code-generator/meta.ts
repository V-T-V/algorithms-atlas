// 格雷码生成 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'gray-code-generator',
  categoryId: 'misc',
  title: { zh: '格雷码生成', en: 'Gray Code Generator' },
  summary: {
    zh: '相邻两数仅一位不同：g(i) = i ^ (i>>1)；可正反向转换与枚举 2ⁿ 个码。',
    en: 'Adjacent codes differ by one bit: g(i) = i ^ (i>>1); convert both ways and enumerate 2ⁿ codes.',
  },
  description: {
    zh: '格雷码（Gray code / 反射二进制码，reflected binary code）是一种二进制数编码，使得任意两个相邻整数对应的格雷码仅有一位二进制位不同。最常见的是「二进制转格雷码」公式：g(i) = i XOR (i >> 1)，即把自然数 i 与其右移一位的值按位异或。例如 i=0..7 的 3 位格雷码为 000,001,011,010,110,111,101,100。反向「格雷码转二进制」是前缀异或的累加：b[i] = g[i] ^ b[i+1]（从高位向低位），或迭代 b = g; while (g >>= 1) b ^= g。格雷码的优势在于「单步变化」：在物理旋转编码器、卡诺图（Karnaugh map）化简逻辑、汉明尔顿路径、九连环等智力题中避免竞争冒险（glitch）。本实现展示逐个生成格雷码、二进制↔格雷码转换与反射构造法。',
    en: 'Gray code (reflected binary code) is a binary numeral encoding in which any two successive integers differ in only one bit. The most common form is the "binary-to-Gray" formula g(i) = i XOR (i >> 1): XOR the natural number i with itself shifted right by one. For example, the 3-bit Gray codes for i=0..7 are 000,001,011,010,110,111,101,100. The inverse "Gray-to-binary" is a prefix-XOR accumulation: b[i] = g[i] ^ b[i+1] (high to low), or iteratively b = g; while (g >>= 1) b ^= g. Gray code\'s "single-step change" property avoids glitches in rotary encoders, simplifies Karnaugh-map logic minimisation, and models Hamiltonian paths and puzzles like the Tower of Hanoi rings. This implementation shows per-code generation, both conversion directions, and the reflected construction.',
  },
  tags: ['misc', 'bit-manipulation', 'gray-code', 'enumeration'],
  complexity: { time: 'O(2ⁿ) 枚举 / O(1) 转换', space: 'O(2ⁿ) 枚举' },
};
