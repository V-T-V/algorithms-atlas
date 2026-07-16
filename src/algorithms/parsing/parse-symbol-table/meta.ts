// 符号表管理 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parse-symbol-table',
  categoryId: 'parsing',
  title: { zh: '符号表管理', en: 'Symbol Table Management' },
  summary: {
    zh: '用哈希表登记变量/函数的声明信息，支持插入、查找、重复定义检测。',
    en: 'A hash table recording variable/function declarations, with insert, lookup, and redefinition checks.',
  },
  description: {
    zh: '符号表（Symbol Table）是编译器前端的核心数据结构：在词法/语法分析后，把每个标识符的名字映射到其声明信息（类型、作用域、种类、内存偏移等）。本实现用 Map 作为单层符号表，提供 enter(name, info) 插入、lookup(name) 查询，并检测重复定义（同作用域同名声明报错）。它是一切作用域解析、类型检查的基础。复杂度：理想 O(1) 平均（哈希），最坏 O(n)。',
    en: 'A symbol table is a core front-end data structure: after lexing/parsing it maps each identifier to its declaration info (type, scope, kind, memory offset, ...). This implementation uses a Map as a single-level table, providing enter(name, info) to insert, lookup(name) to query, and detecting redefinition errors (same name declared twice in one scope). It underpins scope resolution and type checking. Complexity: O(1) average (hash), O(n) worst case.',
  },
  tags: ['parsing', 'symbol-table', 'compiler', 'hashtable'],
  complexity: { time: 'O(1) avg', space: 'O(n)' },
};
