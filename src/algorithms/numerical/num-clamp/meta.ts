// 区间夹紧 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-clamp',
  categoryId: 'numerical',
  title: { zh: '区间夹紧', en: 'Clamp' },
  summary: { zh: '把值限制在 [lo, hi] 内。', en: 'Clamp a value into [lo, hi].' },
  description: { zh: 'clamp(x)=max(lo,min(hi,x))。', en: 'clamp(x)=max(lo,min(hi,x)).' },
  tags: ['numerical', 'arithmetic'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
