// 等式方程可满足 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-satisfy-eq-equations',
  categoryId: 'network',
  title: { zh: '等式方程可满足', en: 'Satisfiability of Equations' },
  summary: {
    zh: '判断 == 与 != 方程组是否自洽（并查集）。',
    en: 'Check consistency of == and != equations via union-find.',
  },
  description: {
    zh: '先 union 所有 == ，再检查所有 != 是否同根。',
    en: 'Union ==, check != . O(E α).',
  },
  tags: ['network', 'graph', 'union-find'],
  complexity: { time: 'O(E α)', space: 'O(V)' },
};
