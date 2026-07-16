// 进位传播 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-carry-add-2',
  categoryId: 'bitwise',
  title: { zh: '进位传播', en: 'Carry Propagation' },
  summary: {
    zh: '模拟对一组二进制位做进位传播，常用于大数加法。',
    en: 'Simulate carry propagation across a bit array (big-number addition).',
  },
  description: {
    zh: '从低到高：若该位 ≥ 2，则进位到高位，本位 mod 2。',
    en: 'Per-bit: if value >= 2, carry to the next. O(n).',
  },
  tags: ['bitwise', 'carry', 'addition'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
