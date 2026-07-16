// 通用哈希族（Universal Hash Family）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'hash-universal-class',
  categoryId: 'hashing',
  title: { zh: '通用哈希族', en: 'Universal Hash Family' },
  summary: {
    zh: '随机选 h_{a,b}(x)=((ax+b) mod p) mod m，碰撞概率 ≤ 1/m。',
    en: 'Randomly pick h_{a,b}(x)=((ax+b) mod p) mod m; collision prob <= 1/m.',
  },
  description: {
    zh: '通用哈希族：h_{a,b}(x) = ((a·x+b) mod p) mod m，a∈[1,p), b∈[0,p)，p 为大素数。任意两键碰撞 ≤ 1/m。',
    en: 'Universal family: h_{a,b}(x)=((a·x+b) mod p) mod m, a in [1,p), b in [0,p), p prime. Any two keys collide <= 1/m.',
  },
  tags: ['hashing', 'universal', 'randomized'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
