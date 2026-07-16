// 求根公式 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-quadratic-formula',
  categoryId: 'numerical',
  title: { zh: '求根公式', en: 'Quadratic Formula' },
  summary: {
    zh: '求解一元二次方程 ax²+bx+c=0。',
    en: 'Solve ax²+bx+c=0 via the quadratic formula.',
  },
  description: {
    zh: '判别式 Δ=b²-4ac：Δ>0 两实根，Δ=0 重根，Δ<0 共轭复根。',
    en: 'Discriminant Δ=b²-4ac: two real / double / conjugate-complex roots.',
  },
  tags: ['numerical', 'root-finding', 'algebra'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
