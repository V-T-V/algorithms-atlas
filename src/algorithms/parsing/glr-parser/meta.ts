// Generalized LR Parser · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'glr-parser',
  categoryId: 'parsing',
  title: { zh: '广义 LR 解析器', en: 'Generalized LR Parser' },
  summary: {
    zh: '广义 LR（GLR）解析器维护一组并行的 LR 栈头，可在移进-归约冲突处分裂，从而解析歧义或有歧义文法并生成解析森林。',
    en: 'A Generalized LR (GLR) parser maintains a set of parallel LR stack heads that split on shift/reduce conflicts, allowing it to parse ambiguous grammars and yield a shared packed parse forest.',
  },
  description: {
    zh: 'GLR 解析（Tomita 算法）扩展经典 LR 解析：当某状态同时存在多个合法动作（移进/归约冲突）时，栈头分裂为多个分支并行推进。等价配置做图合并（graph-structured stack）以避免指数爆炸。对自然二义文法（如表达式结合性、悬空 else）无需手工改写即可处理。复杂度 O(n³)（最坏，高度歧义），通常近线性。',
    en: "GLR parsing (Tomita's algorithm) extends classic LR parsing: when a state has multiple legal actions (shift/reduce conflicts), the stack head splits into branches that advance in parallel. Equivalent configurations are merged via a graph-structured stack to avoid exponential blowup. Naturally ambiguous grammars (operator associativity, dangling-else) need no manual rewriting. Complexity O(n³) worst case (high ambiguity), near-linear in practice.",
  },
  tags: ['parsing', 'lr', 'ambiguous', 'dynamic-programming'],
  complexity: { time: 'O(n³)', space: 'O(n²)' },
};
