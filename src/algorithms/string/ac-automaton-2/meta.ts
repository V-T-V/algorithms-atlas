// AC Automaton Enhanced · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'ac-automaton-2',
  categoryId: 'string',
  title: { zh: 'AC自动机增强', en: 'AC Automaton Enhanced' },
  summary: {
    zh: 'AC自动机增强属于string类别。',
    en: 'AC Automaton Enhanced is a string algorithm.',
  },
  description: {
    zh: 'AC自动机增强（AC Automaton Enhanced）属于string类别的算法。',
    en: 'AC Automaton Enhanced is an algorithm in the string category.',
  },
  tags: ["string"],
  complexity: { time: 'O(Σ|pat|+|text|+命中)', space: 'O(Σ|pat|+命中)' },
};
