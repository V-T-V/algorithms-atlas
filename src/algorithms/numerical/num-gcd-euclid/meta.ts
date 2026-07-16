// 欧几里得 GCD · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-gcd-euclid',
  categoryId: 'numerical',
  title: { zh: '欧几里得 GCD', en: 'Euclidean GCD' },
  summary: {
    zh: '辗转相除求最大公约数。',
    en: 'Greatest common divisor via the Euclidean algorithm.',
  },
  description: {
    zh: 'gcd(a,b)=gcd(b,a mod b)，终止于 b=0。',
    en: 'gcd(a,b)=gcd(b,a mod b) until b=0.',
  },
  tags: ['numerical', 'number-theory'],
  complexity: { time: 'O(log min(a,b))', space: 'O(1)' },
};
