// 测试位v2 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-test-bit-2',
  categoryId: 'bitwise',
  title: { zh: '测试位v2', en: 'Test Bit v2' },
  summary: { zh: '测试第 i 位是否为 1：(x >> i) & 1。', en: 'Test bit i: (x >> i) & 1.' },
  description: { zh: '右移 i 位后取最低位。', en: '(x >>> i) & 1. O(1).' },
  tags: ['bitwise', 'test-bit'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
