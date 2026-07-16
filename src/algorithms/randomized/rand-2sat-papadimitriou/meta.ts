// 随机化 2-SAT (Papadimitriou) · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-2sat-papadimitriou',
  categoryId: 'randomized',
  title: { zh: '随机化 2-SAT (Papadimitriou)', en: 'Randomized 2-SAT (Papadimitriou)' },
  summary: {
    zh: 'Papadimitriou 随机局部搜索求解 2-SAT。',
    en: 'Papadimitriou random local search for 2-SAT.',
  },
  description: {
    zh: '随机初始化，翻改变量直到可满足或重启。',
    en: 'Random init, flip until satisfied or restart.',
  },
  tags: ['randomized', 'sat'],
  complexity: { time: 'O(n²·log n)', space: 'O(n)' },
};
