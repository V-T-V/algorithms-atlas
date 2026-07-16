// 拉斯维加斯线性规划 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-las-vegas-linear',
  categoryId: 'randomized',
  title: { zh: '拉斯维加斯线性规划', en: 'Las Vegas Random LP (Seidel)' },
  summary: {
    zh: 'Seidel 拉斯维加斯算法求解低维 LP。',
    en: "Seidel's Las Vegas algorithm for low-dim LP.",
  },
  description: {
    zh: '增量加入约束，违反则递归。',
    en: 'Incrementally add constraints; recurse if violated.',
  },
  tags: ['randomized', 'lp', 'las-vegas'],
  complexity: { time: 'O(d!·n)', space: 'O(d)' },
};
