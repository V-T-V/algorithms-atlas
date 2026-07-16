// Lottery Scheduling · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'lottery',
  categoryId: 'scheduling',
  title: { zh: '彩票调度', en: 'Lottery Scheduling' },
  summary: {
    zh: '概率性调度：每进程持彩票数正比于优先级，每轮随机抽取决定运行者。',
    en: 'Probabilistic scheduling: each process holds tickets proportional to its priority; a random draw each round picks the runner.',
  },
  description: {
    zh: '彩票调度（Lottery Scheduling）由 Waldspurger 与 Weihl 于 1994 年提出，是一种基于随机数的「概率公平」调度算法。\n\n核心思想：把 CPU 份额抽象为「彩票」。每个进程持有若干张彩票，彩票数正比于它应得的 CPU 份额（即优先级）。每轮调度从所有存活进程的彩票中随机抽取一张，持有者获得一个时间片。大数定律保证：长期来看，每个进程获得的 CPU 时间比例会趋近于「其彩票数 / 总彩票数」。\n\n优点：实现简单、公平、自然支持动态优先级（增减彩票即可调整份额）、可「彩票转让」实现客户-服务器资源传递。缺点：短期可能偏离理想份额（随机噪声），且对随机数质量敏感。本实现用 mulberry32 确定性 PRNG，固定种子可复现。',
    en: 'Lottery Scheduling, introduced by Waldspurger and Weihl in 1994, is a randomized "probabilistically fair" scheduling algorithm.\n\nCore idea: CPU share is modeled as "tickets". Each process holds a number of tickets proportional to its desired CPU share (i.e. priority). Each scheduling round randomly draws one ticket among all live processes; the holder gets a time slice. By the law of large numbers, over the long run each process\'s CPU fraction converges to "its tickets / total tickets".\n\nAdvantages: simple, fair, naturally supports dynamic priority (add/remove tickets to change share), and allows "ticket transfer" for client-server resource passing. Drawbacks: short-term share may deviate (random noise) and the result is sensitive to RNG quality. This implementation uses the mulberry32 deterministic PRNG, so a fixed seed is reproducible.',
  },
  tags: ["scheduling"],
  complexity: { time: 'O(D·n)', space: 'O(n)' },
};
