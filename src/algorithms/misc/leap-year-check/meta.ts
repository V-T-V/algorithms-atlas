// 闰年判定 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'leap-year-check',
  categoryId: 'misc',
  title: { zh: '闰年判定', en: 'Leap Year Check' },
  summary: {
    zh: '能被 4 整除且（不被 100 整除或被 400 整除）的年份是闰年。',
    en: 'A year is leap if divisible by 4 and (not by 100, or by 400).',
  },
  description: {
    zh: '闰年判定遵循格里高利历（公历）规则：一个年份 year 是闰年，当且仅当它能被 4 整除，且（不能被 100 整除，或能被 400 整除）。逻辑表达式：year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)。背景：地球公转约 365.2425 天，每 4 年加 1 天会多算，故每 100 年少闰一次；但这又会少算，故每 400 年再补闰一次。例如 2000 是闰年（被 400 整除），1900 不是（被 100 整除但不被 400），2024 是闰年。本实现附带钩子展示三步判定过程。',
    en: 'Leap-year determination follows the Gregorian calendar rule: a year is a leap year if and only if it is divisible by 4, and (not divisible by 100, or divisible by 400). As a boolean: year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0). Rationale: Earth orbits in about 365.2425 days; adding a day every 4 years over-corrects, so every 100 years skips a leap; that under-corrects, so every 400 years restores it. For example, 2000 is leap (divisible by 400), 1900 is not (divisible by 100 but not 400), 2024 is leap. This implementation attaches hooks to show the three-step evaluation.',
  },
  tags: ['misc', 'calendar', 'modulo'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
