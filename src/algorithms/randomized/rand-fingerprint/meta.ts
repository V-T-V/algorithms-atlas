// 随机指纹 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-fingerprint',
  categoryId: 'randomized',
  title: { zh: '随机指纹', en: 'Random Fingerprinting' },
  summary: { zh: '随机化字符串相等性指纹。', en: 'Randomized string-equality fingerprint.' },
  description: {
    zh: '用随机多项式求值检验（Schwartz-Zippell 思想）。',
    en: 'Polynomial evaluation check (Schwartz-Zippell idea).',
  },
  tags: ['randomized', 'fingerprint'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
