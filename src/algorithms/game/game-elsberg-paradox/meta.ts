// 埃尔斯伯格悖论（Ellsberg Paradox）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'game-elsberg-paradox',
  categoryId: 'game',
  title: { zh: '埃尔斯伯格悖论', en: 'Ellsberg Paradox' },
  summary: {
    zh: '决策者偏好已知概率胜过模糊概率，违反主观期望效用公理。',
    en: 'Decision makers prefer known-probability bets over ambiguous ones, violating SEU axioms.',
  },
  description: {
    zh: '埃尔斯伯格：坛中 90 球，30 红 + 60（黑或黄未知比例）。多数人选"红"而非"黑"，又选"黑或黄"而非"红或黄"，违反 sure-thing 原理。',
    en: 'Ellsberg: urn of 90 balls, 30 red + 60 (black or yellow, unknown split). Most prefer "red" over "black", yet "black or yellow" over "red or yellow", violating sure-thing.',
  },
  tags: ['game', 'decision-theory', 'ambiguity'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
