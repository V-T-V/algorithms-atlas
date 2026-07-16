// RAdam · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'opt-radam-2',
  categoryId: 'optimization',
  title: { zh: 'RAdam', en: 'Rectified Adam (RAdam)' },
  summary: {
    zh: 'RAdam：基于收敛性分析给出预热项 ρt，无需手动 warmup。',
    en: 'RAdam: derives a rectification term ρt analytically, removing the need for manual warmup.',
  },
  description: {
    zh: 'RAdam（Liu 2019）：根据二阶动量的方差引入修正因子 ρt，自动调节有效步长，避免训练初期方差爆炸。',
    en: 'RAdam (Liu 2019): introduces a rectification factor ρt from the variance of second moments, automatically tuning effective step size without manual warmup.',
  },
  tags: ['optimization', 'adam', 'warmup'],
  complexity: { time: 'O(k·d)', space: 'O(d)' },
};
