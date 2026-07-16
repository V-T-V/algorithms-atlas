// PEG Expression Parser · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'peg-expression',
  categoryId: 'parsing',
  title: {
    zh: 'PEG 表达式解析器（文法串编译）',
    en: 'PEG Expression Parser (Grammar-String Compilation)',
  },
  summary: {
    zh: 'PEG 表达式解析器把 PEG 文法源码字符串（如 Expr <- Term ("+" Term)*）解析为表达式树，再递归求值做匹配。',
    en: 'A PEG expression parser parses a PEG grammar source string (e.g. Expr <- Term ("+" Term)*) into an expression tree, then evaluates it recursively to perform matching.',
  },
  description: {
    zh: '本算法与 packrat-parser（基于对象文法 + 记忆化）不同：这里把 PEG 文法当作「待解析的字符串」——用一个解析器组合子风格的小解析器读入文法文本，构造表达式 AST（字面量 / 字符类 / 序列 / 有序选择 / 重复 / 命名引用 / 断言），再用递归求值器在输入上做 PEG 匹配。支持 /（有序选择）、* + ?（重复）、& !（前瞻断言）、( )（分组）、[ ]（字符类）、单引号字面量。解析的是「文法本身」，故名 peg-expression。零 DOM 依赖，可独立单测。',
    en: 'Unlike packrat-parser (object-based grammar + memoization), this algorithm treats the PEG grammar as a string to be parsed: a small combinator-style parser reads the grammar text and builds an expression AST (literal / char class / sequence / ordered choice / repetition / named reference / predicate), then a recursive evaluator performs PEG matching on input. Supports / (ordered choice), * + ? (repetition), & ! (lookahead predicates), ( ) (grouping), [ ] (char class), \'...\' (literal). It parses "the grammar itself", hence peg-expression. Zero DOM dependencies, independently unit-testable.',
  },
  tags: ['parsing', 'peg', 'grammar', 'compiler'],
  complexity: { time: 'O(n·g)', space: 'O(g)' },
};
