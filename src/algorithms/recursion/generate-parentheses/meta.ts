// Generate Parentheses · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'generate-parentheses',
  categoryId: 'recursion',
  title: { zh: '生成括号', en: 'Generate Parentheses' },
  summary: {
    zh: '回溯经典：在「右括号数 ≤ 左括号数」约束下枚举所有 n 对合法括号组合。',
    en: 'Backtracking classic: enumerate all well-formed combinations of n pairs of parentheses under "close ≤ open" constraint.',
  },
  description: {
    zh: '生成括号（Generate Parentheses）是回溯算法的教科书级问题：给定 n 对括号，请生成所有可能的、合法的括号组合。\n\n核心思路：在 2n 个位置上逐个选择放左括号或右括号，并维护两个计数：\n  - open：已使用的左括号数\n  - close：已使用的右括号数\n\n约束：\n  - open ≤ n（左括号总数受限）\n  - close ≤ open（任意前缀中右括号不能比左括号多，否则非法）\n  - 当 open = close = n 时收集一个完整解\n\n每当 open < n 就尝试放左括号；每当 close < open 就尝试放右括号。递归返回时弹出刚才放的字符（即「回溯」），恢复状态去尝试其它分支。结果数等于第 n 个卡塔兰数 C_n = (2n)!/((n+1)!·n!)：n=3 时为 5，n=4 时为 14。\n\n时间复杂度 O(4^n/√n)（与卡塔兰数同阶，每解构造 O(n)），空间 O(n)（递归栈 + 缓冲区）。',
    en: "Generate Parentheses is a textbook backtracking problem: given n pairs of parentheses, generate all well-formed combinations.\n\nCore idea: fill 2n positions one by one with either '(' or ')', tracking two counters:\n  - open: number of '(' used so far\n  - close: number of ')' used so far\n\nConstraints:\n  - open ≤ n (left parentheses are bounded)\n  - close ≤ open (no prefix may have more ')' than '(', else invalid)\n  - when open = close = n, collect a complete solution\n\nWhenever open < n, try placing '('; whenever close < open, try placing ')'. On returning from recursion, pop the just-placed character (this is \"backtracking\"), restoring the state to try another branch. The number of results equals the n-th Catalan number C_n = (2n)!/((n+1)!n!): 5 for n=3, 14 for n=4.\n\nTime complexity O(4^n/√n) (same order as Catalan numbers; O(n) to build each solution); space O(n) (recursion stack + buffer).",
  },
  tags: ['recursion', 'backtracking', 'combinatorics'],
  complexity: { time: 'O(4^n/√n)', space: 'O(n)' },
};
