// 角度弧度互转 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-deg-rad-conv',
  categoryId: 'numerical',
  title: { zh: '角度弧度互转', en: 'Degree-Radian Conversion' },
  summary: { zh: '角度与弧度互转。', en: 'Convert between degrees and radians.' },
  description: {
    zh: 'rad = deg·π/180，deg = rad·180/π。',
    en: 'rad = deg·π/180; deg = rad·180/π.',
  },
  tags: ['numerical', 'trigonometry'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
