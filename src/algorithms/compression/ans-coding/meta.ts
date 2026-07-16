// 非对称数制编码 (ANS) · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ans-coding',
  categoryId: 'compression',
  title: { zh: '非对称数制编码 (ANS)', en: 'Asymmetric Numeral Systems (ANS)' },
  summary: {
    zh: '用一个大整数 x 编码整条符号流，单符号概率近似熵。',
    en: 'Encodes a whole symbol stream into one large integer x with near-entropy per-symbol rates.',
  },
  description: {
    zh: 'ANS（Asymmetric Numeral Systems）把整条消息编码成单个大整数 x：每加入一个符号 s，按其频率 fs 更新 x = fs * (x / Fs) + xs + (x mod Fs)，其中 Fs 是 s 的累积频率。解码反向还原。它兼具 Huffman 的速度与算术编码的压缩率。本实现用 rANS 变体并演示编/解码单步。',
    en: 'ANS (Asymmetric Numeral Systems) encodes a whole message into a single large integer x: appending symbol s updates x = fs * (x / Fs) + xs + (x mod Fs), where Fs is the cumulative frequency of s. Decoding inverts this. It combines Huffman-like speed with arithmetic-coding-like ratios. This implementation uses the rANS variant and demonstrates single-step encode/decode.',
  },
  tags: ['compression', 'entropy', 'lossless'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
