// Phaser 同步阶段（Phaser）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'conc-phaser',
  categoryId: 'concurrency',
  title: { zh: 'Phaser 同步阶段', en: 'Phaser' },
  summary: { zh: '可变参与方的多阶段屏障。', en: 'Variable-party multi-phase barrier.' },
  description: {
    zh: 'Phaser(Java)支持动态增减参与方，每代(generation)等待全部到达后一起前进，适合分阶段并行计算。',
    en: 'Phaser (Java) supports dynamic parties; each generation waits for all arrivals before advancing, suited to phased parallel computation.',
  },
  tags: ['concurrency', 'phaser', 'barrier'],
  complexity: { time: 'O(p) per phase', space: 'O(p)' },
};
