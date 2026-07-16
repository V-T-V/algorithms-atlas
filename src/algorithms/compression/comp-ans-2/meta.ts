// ANS 综合演示 v2（ANS Overview v2）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'comp-ans-2',
  categoryId: 'compression',
  title: { zh: 'ANS 综合演示 v2', en: 'ANS Overview v2' },
  summary: {
    zh: 'ANS 综合：演示 rANS/tANS 的统一状态机模型。',
    en: 'ANS overview: demonstrate the unified state-machine model behind rANS/tANS.',
  },
  description: {
    zh: 'ANS（Asymmetric Numeral Systems）核心是一个整数状态 x：编码符号 s 使 x 增大（相当于把符号「挤入」一个超大进制数）。本实现演示统一接口。',
    en: 'ANS core is an integer state x: encoding symbol s grows x (as if pushing the symbol into a big-base numeral). This impl shows the unified interface.',
  },
  tags: ['compression', 'ans', 'entropy', 'overview'],
  complexity: { time: 'O(n)', space: 'O(σ)' },
};
