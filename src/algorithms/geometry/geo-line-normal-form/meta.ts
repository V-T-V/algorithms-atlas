// 直线一般式转法线式 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-line-normal-form',
  categoryId: 'geometry',
  title: { zh: '直线一般式转法线式', en: 'Line General to Normal Form' },
  summary: {
    zh: '把直线 ax+by+c=0 归一化为法线式。',
    en: 'Normalize line ax+by+c=0 into normal form.',
  },
  description: {
    zh: '除以 √(a²+b²) 得到法线式，符号使 c≤0。',
    en: 'Divide by √(a²+b²); sign chosen so c≤0.',
  },
  tags: ['geometry', 'line'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
