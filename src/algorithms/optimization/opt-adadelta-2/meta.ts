// AdaDelta · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'opt-adadelta-2',
  categoryId: 'optimization',
  title: { zh: 'AdaDelta', en: 'AdaDelta' },
  summary: {
    zh: 'AdaDelta：无需手动学习率，用两次滑动平均自适应。',
    en: 'AdaDelta: no manual learning rate; uses two moving averages for adaptation.',
  },
  description: {
    zh: 'AdaDelta（Zeiler 2012）：在 RMSProp 基础上引入 Δθ 的滑动平均，自动确定有效步长，无需全局学习率。',
    en: 'AdaDelta (Zeiler 2012): extends RMSProp with a moving average of Δθ to self-determine step size without a global learning rate.',
  },
  tags: ['optimization', 'adaptive'],
  complexity: { time: 'O(k·d)', space: 'O(d)' },
};
