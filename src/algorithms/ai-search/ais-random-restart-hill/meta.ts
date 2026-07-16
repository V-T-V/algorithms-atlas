// 随机重启爬山（Random-Restart Hill Climbing）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'ais-random-restart-hill',
  categoryId: 'ai-search',
  title: { zh: '随机重启爬山', en: 'Random-Restart Hill Climbing' },
  summary: { zh: '陷入局部最优即随机重启。', en: 'Restarts from random state on local optimum.' },
  description: {
    zh: '随机重启爬山在到达局部最优时重置到随机起点，多次重启以逼近全局最优。',
    en: 'Random-restart hill climbing restarts from a random state upon hitting a local optimum to approximate the global one.',
  },
  tags: ['ai-search', 'hill-climbing', 'restart'],
  complexity: { time: 'O(r * s)', space: 'O(1)' },
};
