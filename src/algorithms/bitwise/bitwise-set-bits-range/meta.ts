// 区间置位 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'bitwise-set-bits-range',
  categoryId: 'bitwise',
  title: { zh: '区间置位（Set Bits in Range）', en: 'Set Bits in Range' },
  summary: {
    zh: '把整数 value 的 [lo, hi] 位区间全部置 1，其余位不变。',
    en: 'Set all bits in the inclusive range [lo, hi] of value to 1, leaving others unchanged.',
  },
  description: {
    zh:
      '区间置位（Set Bits in Range）：把一个整数中第 lo 位到第 hi 位（含）全部置为 1，其余位保持不变。' +
      '\n核心技巧：构造「区间全 1 掩码」再与原值按位或。' +
      '\n- 区间长度 len = hi - lo + 1' +
      '\n- 全 1 掩码：`(1 << len) - 1`（例如 len=4 → 0b1111）' +
      '\n- 左移到目标位置：`mask << lo`' +
      '\n- 结果：`value | (mask << lo)`' +
      '\n位序约定：第 0 位是最低有效位（LSB）。' +
      '\n时间 `O(1)`，空间 `O(1)`。',
    en:
      'Set Bits in Range: set bits lo..hi (inclusive) of an integer to 1, leaving all other bits unchanged. ' +
      '\nCore trick: build an all-ones mask over the range and OR it into the value. ' +
      '\n- Length len = hi - lo + 1 ' +
      '\n- All-ones mask: (1 << len) - 1 (e.g. len=4 → 0b1111) ' +
      '\n- Shift to position: mask << lo ' +
      '\n- Result: value | (mask << lo) ' +
      '\nBit numbering: bit 0 is the least significant bit (LSB). ' +
      '\nTime O(1), space O(1).',
  },
  tags: ['bitwise', 'mask', 'set', 'range'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
