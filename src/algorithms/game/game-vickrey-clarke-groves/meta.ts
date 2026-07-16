// VCG 机制（Vickrey-Clarke-Groves Mechanism）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'game-vickrey-clarke-groves',
  categoryId: 'game',
  title: { zh: 'VCG 机制', en: 'Vickrey-Clarke-Groves Mechanism' },
  summary: {
    zh: '报告真实估值是占优策略，最大化社会福利，收取 Clarke 外部性。',
    en: 'Truthful reporting is dominant, social welfare maximized, charge equals Clarke externality.',
  },
  description: {
    zh: 'VCG：选社会福利最大分配，每人支付其对他人造成的外部性（他人无他时福利 - 有他时福利）。激励相容。',
    en: 'VCG: pick welfare-maximizing allocation; each pays their Clarke externality (others welfare without - with them). Strategy-proof.',
  },
  tags: ['game', 'mechanism-design', 'auction'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
