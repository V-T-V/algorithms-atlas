// 萤火虫算法（Firefly Algorithm）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'opt-firefly-2',
  categoryId: 'optimization',
  title: { zh: '萤火虫算法', en: 'Firefly Algorithm' },
  summary: {
    zh: '模拟萤火虫相互吸引，亮度高的吸引低的，亮度∝目标值。',
    en: 'Fireflies attract each other proportional to brightness; brightness ties to fitness.',
  },
  description: {
    zh: '萤火虫算法：每只萤火虫亮度=1/(1+f)。低亮度被高亮度吸引：x←x+β·e^{-γr²}·(j-i)+α·ε。',
    en: 'Firefly: brightness=1/(1+f). Less bright moves toward brighter: x<-x+βe^{-γr²}(j-i)+αε.',
  },
  tags: ['optimization', 'metaheuristic', 'swarm'],
  complexity: { time: 'O(k·n²·d)', space: 'O(n·d)' },
};
