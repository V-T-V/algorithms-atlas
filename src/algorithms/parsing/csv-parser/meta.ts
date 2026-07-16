// CSV Parser · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'csv-parser',
  categoryId: 'parsing',
  title: { zh: 'CSV 解析器（状态机）', en: 'CSV Parser (State Machine)' },
  summary: {
    zh: '状态机逐字符解析 CSV：支持引号字段、引号转义（""）、字段内换行。',
    en: 'A character-by-character state machine for CSV: quoted fields, escaped quotes (""), and embedded newlines.',
  },
  description: {
    zh: 'CSV 解析看似简单，实则需要正确处理引号字段、转义双引号（两个连续引号表示一个字面引号）、以及字段内换行。本实现用一个显式状态机逐字符扫描，状态包括：FieldStart（字段开始）、Unquoted（未引号字段体）、Quoted（引号字段体）、QuoteEnd（引号字段内遇引号，待判定是结束还是转义）。当处于 QuoteEnd 且下一字符仍是引号时按转义处理（输出一个字面引号并回到 Quoted），否则字段结束。换行符按 \\r\\n / \\n / \\r 统一处理为记录分隔。该状态机是 RFC 4180 风格 CSV 的教学实现。',
    en: 'CSV parsing looks simple but must correctly handle quoted fields, escaped double-quotes (two consecutive quotes denote one literal quote), and newlines embedded inside fields. This implementation uses an explicit state machine scanning character by character with states: FieldStart, Unquoted (unquoted body), Quoted (quoted body), and QuoteEnd (a quote seen inside a quoted field, awaiting whether it closes the field or escapes). If the next character in QuoteEnd is again a quote, it is treated as an escape (emit one literal quote and return to Quoted); otherwise the field closes. Newlines (\\r\\n / \\n / \\r) are normalized as record separators. This is a teaching implementation in the spirit of RFC 4180.',
  },
  tags: ['parsing', 'csv', 'state-machine', 'format'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
