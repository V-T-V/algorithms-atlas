// 复数加减法 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-complex-add',
  categoryId: 'numerical',
  title: { zh: '复数加减法', en: 'Complex Number Arithmetic' },
  summary: { zh: '复数加减乘运算。', en: 'Add/subtract/multiply complex numbers.' },
  description: {
    zh: '(a+bi)±(c+di)，乘法 (ac-bd)+(ad+bc)i。',
    en: '(a+bi)±(c+di); product (ac-bd)+(ad+bc)i.',
  },
  tags: ['numerical', 'complex'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
