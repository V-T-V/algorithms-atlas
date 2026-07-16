// 平滑阶梯 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-smoothstep',
  categoryId: 'numerical',
  title: { zh: '平滑阶梯', en: 'Smoothstep' },
  summary: { zh: '平滑的 0→1 过渡函数。', en: 'Smooth 0→1 transition function.' },
  description: {
    zh: 't=clamp((x-e0)/(e1-e0),0,1)，返回 t·t·(3-2t)。',
    en: 't=clamp((x-e0)/(e1-e0),0,1); return t·t·(3-2t).',
  },
  tags: ['numerical', 'interpolation'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
