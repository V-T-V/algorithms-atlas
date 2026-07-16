import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parse-csv-streaming',
  categoryId: 'parsing',
  title: { zh: '流式 CSV 解析', en: 'Streaming CSV Parser' },
  summary: {
    zh: '逐块输入、跨块保留状态地解析 CSV（支持引号、换行）。',
    en: 'Parse CSV incrementally across chunks, handling quotes and embedded newlines.',
  },
  description: {
    zh: '维护当前字段缓冲与引号状态；遇分隔符或换行提交记录；块尾时保留缓冲等下一块。',
    en: 'Keep a field buffer and in-quote flag; emit records on delimiter/newline; preserve state across chunks.',
  },
  tags: ['parsing', 'csv', 'streaming'],
  complexity: { time: 'O(n)', space: 'O(line)' },
};
