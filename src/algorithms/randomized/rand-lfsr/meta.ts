// 线性反馈移位寄存器 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'rand-lfsr',
  categoryId: 'randomized',
  title: { zh: '线性反馈移位寄存器 (LFSR)', en: 'Linear Feedback Shift Register (LFSR)' },
  summary: {
    zh: 'Galois/Fibonacci LFSR：按反馈多项式异或移位，周期 2^n-1。',
    en: 'Galois/Fibonacci LFSR: shift with XOR feedback per a polynomial; period 2^n-1.',
  },
  description: {
    zh: 'LFSR 是硬件友好的伪随机源：寄存器每步右移，空出的最高位由若干抽头（taps）异或得到。最大长度 LFSR（m-序列）周期为 2^n-1。常用 16/32 位抽头（如 16 位 taps: 0xB400）。',
    en: 'An LFSR is a hardware-friendly pseudo-random source: each step shifts the register right, and the vacated MSB is the XOR of selected taps. A maximal-length LFSR (m-sequence) has period 2^n-1. Common 16/32-bit taps (e.g., 16-bit taps: 0xB400).',
  },
  tags: ['randomized', 'prng', 'lfsr', 'shift-register'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
