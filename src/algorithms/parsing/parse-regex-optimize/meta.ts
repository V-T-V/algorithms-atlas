// 正则优化 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parse-regex-optimize',
  categoryId: 'parsing',
  title: { zh: '正则 AST 优化', en: 'Regex AST Optimization' },
  summary: {
    zh: '在 AST 层面对正则做代数化简：扁平化、消去空、合并冗余字符。',
    en: 'Algebraically simplify a regex AST: flatten nested nodes, eliminate ε, merge redundant chars.',
  },
  description: {
    zh: '正则匹配的效率与 AST 结构息息相关。本实现做几类等价化简：(1) 扁平化 —— 把嵌套的 concat(concat(a,b),c) 变成 concat(a,b,c)；(2) 消去 ε —— concat 中删去 ε 子节点、若整体为 ε 则归一；(3) 后缀折叠 —— (x*)* → x*、(x+)* → x*、x?* → x*；(4) 选择排序去重 —— alt(a,b,a) → alt(a,b)；(5) 单子节点提升 —— concat([x]) → x、alt([x]) → x；(6) 空选择消去 —— alt(a,ε,ε) → alt(a,ε)。这些变换保持语义不变，可显著减少后续 NFA 状态数。',
    en: 'Regex matching efficiency depends on the AST shape. This implementation performs several equivalent simplifications: (1) flatten nested concat/alt; (2) eliminate ε from concat (and collapse all-ε); (3) fold redundant suffixes (x*)* → x*, (x+)* → x*, x?* → x*; (4) dedupe and sort alt options; (5) lift single-child concat/alt; (6) collapse empty alternatives. All preserve semantics and shrink the downstream NFA state count.',
  },
  tags: ['parsing', 'regex', 'optimization', 'ast'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
