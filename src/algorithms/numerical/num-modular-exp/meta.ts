// 快速模幂 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-modular-exp',
  categoryId: 'numerical',
  title: { zh: '快速模幂', en: 'Modular Exponentiation' },
  summary: {
    zh: '计算 (base^exp) mod m 的快速幂。',
    en: 'Compute (base^exp) mod m via fast exponentiation.',
  },
  description: {
    zh: '平方-乘法，O(log exp)，避免大数溢出。',
    en: 'Square-and-multiply in O(log exp); avoids overflow.',
  },
  tags: ['numerical', 'number-theory', 'modular'],
  complexity: { time: 'O(log exp)', space: 'O(1)' },
};
