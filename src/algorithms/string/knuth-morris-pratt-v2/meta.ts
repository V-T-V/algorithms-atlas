// Knuth-Morris-Pratt v2 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'knuth-morris-pratt-v2',
  categoryId: 'string',
  title: { zh: 'KMP 搜索（完整版）', en: 'KMP Search (Complete)' },
  summary: {
    zh: '构造前缀函数后扫描文本，O(n+m) 内报告所有匹配位置。',
    en: 'Builds the prefix function then scans the text, reporting all matches in O(n+m).',
  },
  description: {
    zh: 'Knuth-Morris-Pratt 完整版（KMP v2）：先对模式串 pat 构造前缀函数 π（π[i] = pat[0..i] 的最长相等真前后缀长度），再用它扫描文本 txt——失配时按 π 回退而非回到起点，从而每个字符至多被比较常数次。\n\n本实现返回**所有**匹配起点（而非仅第一个），并暴露 π 构造与匹配两个阶段的事件钩子，便于可视化。时间 O(n + m)（n=文本长，m=模式长），空间 O(m)。',
    en: 'KMP Complete (v2): first build the prefix function π of the pattern (π[i] = length of the longest proper prefix of pat[0..i] that is also a suffix), then scan the text using π to fall back on mismatch instead of restarting — so each character is compared only a constant number of times.\n\nThis implementation reports *all* match positions (not just the first) and exposes hooks for both the π-construction and the matching phases for visualisation. Time O(n + m) (n = text length, m = pattern length), space O(m).',
  },
  tags: ['string', 'pattern-matching', 'kmp', 'prefix-function', 'linear'],
  complexity: { time: 'O(n+m)', space: 'O(m)' },
};
