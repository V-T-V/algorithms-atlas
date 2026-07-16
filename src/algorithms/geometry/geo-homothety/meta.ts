// 位似变换 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-homothety',
  categoryId: 'geometry',
  title: { zh: '位似变换', en: 'Homothety' },
  summary: {
    zh: '以中心 C、比例 k 对点做位似变换。',
    en: 'Homothety of a point about center C with ratio k.',
  },
  description: {
    zh: 'P′ = C + k(P - C)，k>1 放大，0<k<1 缩小，k<0 反向。',
    en: 'P′ = C + k(P - C); k>1 enlarges, 0<k<1 shrinks, k<0 inverts.',
  },
  tags: ['geometry', 'transformation'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
