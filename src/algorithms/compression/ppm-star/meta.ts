// PPM* 风格变体 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ppm-star',
  categoryId: 'compression',
  title: { zh: 'PPM* 风格变体', en: 'PPM*-style Variant' },
  summary: {
    zh: '上下文建模 + 退避（escape）的概率编码。',
    en: 'Context modelling with escape (back-off) probability coding.',
  },
  description: {
    zh: 'PPM（Prediction by Partial Matching）按变长上下文统计符号频率并编码；PPM* 允许上下文长度自适应。本简化版用「最长匹配 + 一阶退避」演示：对每个符号先在最长上下文里查，未命中则退避到更短的上下文，并累计 escape 概率。最终给出每个符号的编码概率（可外接算术编码）。',
    en: 'PPM (Prediction by Partial Matching) counts symbol frequencies per variable-length context and encodes accordingly; PPM* allows adaptive context length. This simplified version uses longest-match + first-order back-off: for each symbol it looks up the longest context first, escapes to a shorter one on a miss, accumulating escape probabilities, and yields a per-symbol coding probability ready for an arithmetic coder.',
  },
  tags: ['compression', 'context-model', 'lossless'],
  complexity: { time: 'O(n·k)', space: 'O(n·k)' },
};
