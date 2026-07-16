import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'parse-jsonpath',
  categoryId: 'parsing',
  title: { zh: 'JSONPath 查询', en: 'JSONPath Query' },
  summary: {
    zh: '用路径表达式查询嵌套 JSON 数据。',
    en: 'Query nested JSON with path expressions like $.a.b[0].c.',
  },
  description: {
    zh: '解析 $.a.b[0].c 路径，沿对象/数组指针逐级访问。支持通配符 * 与索引 [i]。',
    en: 'Parse $.a.b[0].c and walk object/array pointers. Supports * and [i].',
  },
  tags: ['parsing', 'json', 'query', 'jsonpath'],
  complexity: { time: 'O(n)', space: 'O(path)' },
};
