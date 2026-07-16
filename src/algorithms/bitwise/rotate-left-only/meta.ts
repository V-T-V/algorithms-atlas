// 仅循环左移 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rotate-left-only',
  categoryId: 'bitwise',
  title: { zh: '仅循环左移', en: 'Rotate Left Only' },
  summary: {
    zh: '32 位循环左移，移出位从右端回绕。',
    en: '32-bit rotate left; bits shifted out re-enter from the right.',
  },
  description: {
    zh: '循环左移（ROL）：把 32 位字 x 左移 r 位，溢出的高位从最低位重新进入，不丢失任何位。公式 result = (x << r) | (x >>> (32 - r))。与已有的 rotate（同时支持左右）不同，本版本只做左移，更简洁，专门服务于哈希混淆、伪随机扭转等场景。',
    en: 'Rotate left (ROL): shift the 32-bit word x left by r positions; the bits that overflow the top re-enter at the bottom, losing no information. result = (x << r) | (x >>> (32 - r)). Unlike the existing rotate (which supports both directions), this version only rotates left, simpler and tailored to hash mixing and PRNG twisting.',
  },
  tags: ['bitwise', 'rotate', 'rol'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
