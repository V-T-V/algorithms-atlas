// Packrat Parser · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'packrat-parser',
  categoryId: 'parsing',
  title: { zh: 'Packrat 解析', en: 'Packrat Parser' },
  summary: {
    zh: 'PEG + 记忆化：每位置缓存解析结果，保证线性时间无回溯。',
    en: 'PEG with memoization: cache a parse result at each position for guaranteed linear time without backtracking.',
  },
  description: {
    zh: 'Packrat 解析（Bryan Ford 2002）为解析表达文法（PEG）提供线性时间保证。PEG 用有序选择 e1 / e2（先试 e1，失败再试 e2，不同于 CFG 的并行选择）与谓语，解析本质上是带回溯的递归下降。朴素的回溯最坏指数级。Packrat 在「每个输入位置」缓存每条规则的成功/失败结果与消耗长度，使得同一(规则,位置)只算一次，整体降为 O(n)。代价是内存 O(n·|rules|)。本实现用一个小型 PEG 文法（字面量、连接、有序选择、星号重复）演示记忆化表的填充过程。',
    en: "Packrat parsing (Bryan Ford 2002) gives Parsing Expression Grammars (PEGs) a linear-time guarantee. A PEG uses ordered choice e1 / e2 (try e1 first, fall back to e2 on failure, unlike CFG's parallel ambiguity) and predicates, so parsing is inherently backtracking recursive descent. Naive backtracking is exponential in the worst case. Packrat memoizes, at every input position, the success/failure result and consumed length of each rule, so any (rule, position) pair is computed at most once, bringing the total to O(n). The cost is O(n·|rules|) memory. This implementation uses a small PEG (literal, sequence, ordered choice, star-repetition) to demonstrate the memo table being filled.",
  },
  tags: ['parsing', 'peg', 'memoization', 'top-down', 'scannerless'],
  complexity: { time: 'O(n)', space: 'O(n·|rules|)' },
};
