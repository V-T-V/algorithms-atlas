// 作用域解析 · 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parse-scope-resolution',
  categoryId: 'parsing',
  title: { zh: '作用域解析', en: 'Scope Resolution' },
  summary: {
    zh: '用嵌套作用域链表实现「内层屏蔽外层」的名字查找（词法作用域）。',
    en: 'Linked nested scopes implementing lexical lookup where inner declarations shadow outer ones.',
  },
  description: {
    zh: '词法作用域（lexical scoping）下，每个块（函数体、{...}）开启一个新作用域，子作用域可访问父作用域的名字，但同名内层声明会「屏蔽」外层。本实现用「作用域链」：每个 Scope 持有自己的符号表和一个指向父作用域的指针。查找时先在本层找，找不到再沿 parent 链向上。pushScope/popScope 维护栈式结构。这正确处理了变量屏蔽（shadowing）与闭包捕获。',
    en: 'Under lexical scoping, each block (function body, {...}) opens a new scope; child scopes can see parent names but same-name inner declarations shadow outer ones. This implementation uses a "scope chain": each Scope holds its own symbol table plus a pointer to the parent. Lookup first checks the current level, then walks the parent chain. pushScope/popScope maintain the stack structure, correctly handling shadowing and closure capture.',
  },
  tags: ['parsing', 'scope', 'compiler', 'symbol-table'],
  complexity: { time: 'O(d) per lookup', space: 'O(n)' },
};
