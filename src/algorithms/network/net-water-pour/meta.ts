// 水壶问题 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'net-water-pour',
  categoryId: 'network',
  title: { zh: '水壶问题', en: 'Water and Jug Problem' },
  summary: {
    zh: '判断能否用两水壶（容量x,y）与无限水准确量出 z。',
    en: 'Measure exactly z using jugs of capacity x and y.',
  },
  description: {
    zh: 'z ≤ x+y 且 z 是 gcd(x,y) 的倍数。',
    en: 'z <= x+y and z % gcd(x,y) == 0. O(log min).',
  },
  tags: ['network', 'math', 'gcd'],
  complexity: { time: 'O(log min(x,y))', space: 'O(1)' },
};
