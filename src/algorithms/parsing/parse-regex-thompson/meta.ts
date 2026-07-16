import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parse-regex-thompson',
  categoryId: 'parsing',
  title: { zh: 'Thompson 构造法', en: 'Thompson Construction' },
  summary: {
    zh: '把正则表达式编译成 ε-NFA。',
    en: 'Compile a regular expression to an epsilon-NFA with linear states.',
  },
  description: {
    zh: '对字符 c 建 N(c)；A|B 用 ε 分流起点；AB 串接；A* 加 ε 回环。状态数线性。',
    en: 'For c build N(c); A|B epsilon-splits start; AB concatenates; A* adds an epsilon loop.',
  },
  tags: ['parsing', 'regex', 'nfa', 'thompson'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
