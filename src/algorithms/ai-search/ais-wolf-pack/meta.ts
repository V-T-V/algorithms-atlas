// 狼群算法（Wolf Pack Search）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ais-wolf-pack',
  categoryId: 'ai-search',
  title: { zh: '狼群算法', en: 'Wolf Pack Search' },
  summary: {
    zh: '探狼侦察、猛狼围捕、首领更新（Rastrigin 目标）。',
    en: 'Scout wolves reconnoiter, fierce wolves attack, leader updates (Rastrigin target).',
  },
  description: {
    zh: '狼群算法：每代分探狼（在邻域侦察更好位置）和猛狼（朝首领靠近）。本实现以 Rastrigin 函数（多峰）最小化演示。',
    en: 'Wolf pack search: each generation splits into scouts (probe neighborhood) and fierce wolves (move toward leader). Minimizes the multimodal Rastrigin function.',
  },
  tags: ['ai-search', 'swarm', 'optimization', 'wolf-pack'],
  complexity: { time: 'O(iter × wolves × d)', space: 'O(wolves × d)' },
};
