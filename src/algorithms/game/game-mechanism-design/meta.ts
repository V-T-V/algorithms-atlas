// 机制设计（VCG）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-mechanism-design',
  categoryId: 'game',
  title: { zh: '机制设计（VCG）', en: 'Mechanism Design (VCG)' },
  summary: {
    zh: 'Vickrey-Clarke-Groves 机制：分配最大化社会福利，收费等于外部性。',
    en: 'VCG mechanism: allocate to maximize social welfare, charge each player their externality.',
  },
  description: {
    zh: 'VCG 是最经典的激励相容机制：要求每个人报告估值，把物品分给估值最高者，收费 = （没有此人时他人的最大社会福利）−（有此人时他人的社会福利之和）。如实报告是占优策略。',
    en: "VCG is the canonical incentive-compatible mechanism: collect valuation reports, allocate to the highest, and charge the externality = (others' welfare without this player) − (others' welfare with this player). Truthful reporting is dominant.",
  },
  tags: ['game', 'mechanism-design', 'auction'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
