// 最后通牒博弈 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-ultimatum',
  categoryId: 'game',
  title: { zh: '最后通牒博弈', en: 'Ultimatum Game' },
  summary: {
    zh: '提议者分一笔钱，回应者接受则按提案分，拒绝则双方得零。',
    en: 'Proposer offers a split; responder accepts to finalize it, or rejects so both get 0.',
  },
  description: {
    zh: '经典博弈论实验：理性解是提议者几乎全拿、回应者接受任意正份额（子博弈完美）。但人类实验中拒绝不公平提案的现象普遍存在。',
    en: 'Classic experiment: the rational SPE has the proposer take nearly all and the responder accept any positive share. Real humans often reject unfair offers.',
  },
  tags: ['game', 'game-theory', 'bargaining'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
