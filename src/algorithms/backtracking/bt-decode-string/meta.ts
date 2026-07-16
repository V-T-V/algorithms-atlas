// 字符串解码 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-decode-string',
  categoryId: 'backtracking',
  title: { zh: '字符串解码', en: 'Decode String' },
  summary: { zh: '解码 3[a2[c]] → accaccacc。', en: 'Decode 3[a2[c]] into accaccacc.' },
  description: { zh: '递归处理 [...] 块。', en: 'Recurse on brackets. O(n).' },
  tags: ['backtracking', 'string'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
