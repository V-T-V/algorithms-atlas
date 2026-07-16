// Fisher-Yates 洗牌 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'rand-shuffle-fy',
  categoryId: 'randomized',
  title: { zh: 'Fisher-Yates 洗牌', en: 'Fisher-Yates Shuffle' },
  summary: { zh: '原地均匀洗牌数组。', en: 'In-place uniform shuffle.' },
  description: { zh: '从后向前随机交换。', en: 'Swap with random earlier index, from end.' },
  tags: ['randomized', 'shuffle', 'permutation'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
