// 布谷鸟搜索（Cuckoo Search）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-cuckoo-search',
  categoryId: 'ai-search',
  title: { zh: '布谷鸟搜索', en: 'Cuckoo Search' },
  summary: {
    zh: '基于 Lévy 飞行的巢寄生行为，全局探索强。',
    en: 'Nest parasitism with Lévy flights for strong global exploration.',
  },
  description: {
    zh: '布谷鸟搜索（Yang & Deb 2009）：每个巢代表一个解；新解通过 Lévy 飞行 x = x + α·L·(x − xbest) 产生；以概率 pa 丢弃最差巢并随机替换。Lévy 步长用 Mantegna 算法近似。',
    en: 'Cuckoo search (Yang & Deb 2009): each nest is a solution; new solutions come from Lévy flight x = x + α·L·(x − xbest); with probability pa the worst nests are abandoned and randomly replaced. Lévy step approximated by Mantegna.',
  },
  tags: ['ai-search', 'swarm', 'optimization', 'cuckoo', 'levy'],
  complexity: { time: 'O(iter × nests × d)', space: 'O(nests × d)' },
};
