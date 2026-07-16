// 人工蜂群（Artificial Bee Colony）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-bee-colony',
  categoryId: 'ai-search',
  title: { zh: '人工蜂群', en: 'Artificial Bee Colony' },
  summary: {
    zh: '采蜜蜂、观察蜂、侦查蜂协同搜索解空间（Sphere 目标）。',
    en: 'Employed, onlooker, and scout bees collaboratively search (Sphere target).',
  },
  description: {
    zh: '人工蜂群（Karaboga 2005）：采蜜蜂利用食物源并产生邻域候选；观察蜂按质量轮盘赌选择源；连续 limit 轮无改进则变侦查蜂随机重生。本实现最小化 Sphere。',
    en: 'ABC (Karaboga 2005): employed bees exploit food sources and generate neighbor candidates; onlooker bees pick sources by roulette; after "limit" non-improving rounds a source is abandoned and a scout randomly resets it.',
  },
  tags: ['ai-search', 'swarm', 'optimization', 'abc'],
  complexity: { time: 'O(iter × bees × d)', space: 'O(bees × d)' },
};
