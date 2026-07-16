// 统计1块数 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bit-count-blocks-2',
  categoryId: 'bitwise',
  title: { zh: '统计1块数', en: 'Count Runs of Ones' },
  summary: {
    zh: '统计整数二进制中连续 1 段的个数。',
    en: 'Count contiguous runs of 1 bits in an integer.',
  },
  description: {
    zh: '扫描位：在每段「0→1」的上升沿计数一次。',
    en: 'Count rising edges 0->1 across bits. O(bits).',
  },
  tags: ['bitwise', 'runs', 'blocks'],
  complexity: { time: 'O(bits)', space: 'O(1)' },
};
