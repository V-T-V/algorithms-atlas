// n 位格雷码（公式法）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bitwise-gray-code-n',
  categoryId: 'bitwise',
  title: { zh: 'n 位格雷码（公式）', en: 'n-bit Gray Code (Formula)' },
  summary: {
    zh: '用 g(i)=i^(i>>1) 直接生成 n 位格雷码序列（对照反射法）。',
    en: 'Generate n-bit Gray codes directly via g(i)=i^(i>>1) (vs. reflective method).',
  },
  description: {
    zh:
      'n 位格雷码（公式法）：用经典恒等式 `g(i) = i ^ (i >> 1)` 一步生成第 i 个格雷码。' +
      '\n- 循环 i 从 0 到 2^n − 1，逐个应用公式即得完整序列。' +
      '\n- 与反射法（gray-code）相比，公式法代码更短、可随机访问任意下标，但看不到「镜像反射」结构。' +
      '\n时间 `O(2^n)`，空间 `O(2^n)`（存结果）。',
    en:
      'n-bit Gray code (formula): the classic identity g(i) = i ^ (i >> 1) yields the i-th Gray code directly. ' +
      '\n- Loop i from 0 to 2^n − 1, applying the formula to build the full sequence. ' +
      '\n- vs. the reflective method (gray-code), the formula is shorter and supports random access, ' +
      'but hides the mirror-reflect structure. ' +
      'Time O(2^n), space O(2^n) (output).',
  },
  tags: ['bitwise', 'gray-code', 'formula', 'sequence'],
  complexity: { time: 'O(2^n)', space: 'O(2^n)' },
};
