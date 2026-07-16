// 验证回文短语 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'misc-valid-palindrome-phr',
  categoryId: 'misc',
  title: { zh: '验证回文短语', en: 'Valid Palindrome (Phrase)' },
  summary: {
    zh: '只考虑字母数字、忽略大小写，判断短语是否回文。',
    en: 'Consider only alphanumeric, ignore case; check if the phrase is a palindrome.',
  },
  description: {
    zh: 'LeetCode 125 验证回文串：过滤非字母数字、转小写后判断是否左右对称。',
    en: 'LeetCode 125 Valid Palindrome: filter non-alphanumeric, lowercase, then check symmetry.',
  },
  tags: ['misc', 'string', 'two-pointers', 'leetcode'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
