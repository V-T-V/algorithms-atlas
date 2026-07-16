// 花括号展开 II · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-brace-expansion-2',
  categoryId: 'backtracking',
  title: { zh: '花括号展开 II', en: 'Brace Expansion II' },
  summary: {
    zh: '回溯展开含并集与连接的花括号表达式，生成所有可能字符串。',
    en: 'Backtracking to expand brace expressions with union and concatenation into all possible strings.',
  },
  description: {
    zh: '形如 {a,b}{c,{d,e}} 的表达式：逗号表并集，相邻项表连接。递归解析后做笛卡尔积展开。',
    en: 'Expressions like {a,b}{c,{d,e}}: comma denotes union, adjacency denotes concatenation. Parse recursively and expand via Cartesian products.',
  },
  tags: ['backtracking', 'parsing', 'string'],
  complexity: { time: 'O(指数级)', space: 'O(指数级)' },
};
