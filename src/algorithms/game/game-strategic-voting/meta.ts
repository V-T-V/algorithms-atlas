// 策略性投票（Strategic Voting）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'game-strategic-voting',
  categoryId: 'game',
  title: { zh: '策略性投票', en: 'Strategic Voting' },
  summary: {
    zh: '选民非真诚投票以避免最差结果，分析 Gibbard-Satterthwaite 不可防策略。',
    en: 'Voters vote non-truthfully to avoid worst outcomes; analyzes Gibbard-Satterthwaite manipulability.',
  },
  description: {
    zh: '策略性投票：在 plurality 规则下，选民可能谎报偏好以阻止最不喜候选人当选。计算每个选民的"真诚"vs"策略"结果。',
    en: 'Strategic voting under plurality: voters may misreport to block their least-preferred winner. Compute sincere vs strategic outcome per voter.',
  },
  tags: ['game', 'social-choice', 'voting'],
  complexity: { time: 'O(n·m)', space: 'O(m)' },
};
