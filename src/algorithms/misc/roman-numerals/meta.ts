// Roman Numerals · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'roman-numerals',
  categoryId: 'misc',
  title: { zh: '罗马数字转换', en: 'Roman Numerals' },
  summary: {
    zh: '整数与罗马数字（I/V/X/L/C/D/M）之间的双向转换。',
    en: 'Two-way conversion between integers and Roman numerals (I/V/X/L/C/D/M).',
  },
  description: {
    zh: '罗马数字用 7 个基本符号按「相同符号最多连续 3 个、减法记法（如 4=IV、9=IX、900=CM）」规则表示 1..3999 的整数。\n\n- `intToRoman(n)`：贪心策略，从大到小枚举 13 个值—符号对（含 900/400/90/40/9/4 等减法对），逐个减去累加符号。\n- `romanToInt(s)`：从左至右扫描，若当前符号值小于后继则减去（如 IV=−1+5），否则累加。',
    en: 'Roman numerals use seven symbols under the rules "at most three identical symbols in a row" and subtractive notation (4=IV, 9=IX, 900=CM), representing integers 1..3999.\n\n- `intToRoman(n)`: greedy — enumerate 13 value-symbol pairs (including subtractive pairs 900/400/90/40/9/4) from largest to smallest, repeatedly subtracting and appending.\n- `romanToInt(s)`: scan left to right; if a symbol is smaller than its successor subtract it (IV=−1+5), otherwise add it.',
  },
  tags: ['misc', 'string', 'number-theory', 'greedy'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
