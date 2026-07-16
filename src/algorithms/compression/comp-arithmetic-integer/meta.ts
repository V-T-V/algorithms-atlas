// 整数算术编码 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-arithmetic-integer',
  categoryId: 'compression',
  title: { zh: '整数算术编码', en: 'Integer Arithmetic Coding' },
  summary: {
    zh: '用整数区间 [lo, hi) 替代浮点，逐符号缩放并按需 renormalize 输出比特。',
    en: 'Use integer intervals [lo, hi) instead of floats, scaling per symbol with renormalization to emit bits.',
  },
  description: {
    zh: '整数算术编码避免浮点精度问题：\n\n- 维护整数区间 [lo, hi)，初始为 [0, 2^P)。\n- 每个符号按累积频率缩放区间。\n- 当 lo 与 hi 高位确定（相同前缀）时输出比特并左移扩展（renormalize）。\n- 末尾输出足够位数以唯一确定落点。',
    en: 'Integer arithmetic coding avoids float precision issues:\n\n- Maintain integer interval [lo, hi), initially [0, 2^P).\n- Scale per symbol using cumulative frequencies.\n- When lo and hi share high bits, emit and left-shift (renormalize).\n- At the end, emit enough bits to pin the interval.',
  },
  tags: ['compression', 'entropy', 'arithmetic'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
