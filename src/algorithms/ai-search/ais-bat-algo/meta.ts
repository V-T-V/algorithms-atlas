// 蝙蝠算法（Bat Algorithm）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-bat-algo',
  categoryId: 'ai-search',
  title: { zh: '蝙蝠算法', en: 'Bat Algorithm' },
  summary: {
    zh: '模拟蝙蝠回声定位：频率、响度、脉冲率协同搜索。',
    en: 'Mimics bat echolocation via frequency, loudness, and pulse rate.',
  },
  description: {
    zh: '蝙蝠算法（Yang 2010）：每只蝙蝠有频率 f∈[fmin,fmax]、位置 x、速度 v；v = v + (x − xbest)·f；x += v。以脉冲率 r 局部随机游走；以响度 A 概率接受新解。本实现最小化 Sphere。',
    en: 'Bat algorithm (Yang 2010): each bat has frequency f∈[fmin,fmax], position x, velocity v; v = v + (x − xbest)·f; x += v. With pulse rate r do local random walk; accept new solutions with loudness probability A. Minimizes Sphere.',
  },
  tags: ['ai-search', 'swarm', 'optimization', 'bat'],
  complexity: { time: 'O(iter × bats × d)', space: 'O(bats × d)' },
};
