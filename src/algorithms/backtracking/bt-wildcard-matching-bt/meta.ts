// 通配符匹配回溯 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-wildcard-matching-bt',
  categoryId: 'backtracking',
  title: { zh: '通配符匹配（回溯）', en: 'Wildcard Matching (Backtracking)' },
  summary: {
    zh: '回溯实现 ? 与 * 的通配符匹配，记录星号位置回退。',
    en: 'Backtracking wildcard matching with ? and *, recording star positions for backoff.',
  },
  description: {
    zh: '逐字符匹配，遇到 * 记录位置并先尝试匹配 0 字符；失配时回到最近的 * 多匹配一个字符。',
    en: 'Match char by char; at * record position and try zero match first; on mismatch, return to the last star and consume one more char.',
  },
  tags: ['backtracking', 'string', 'wildcard'],
  complexity: { time: 'O(m·n)', space: 'O(1)' },
};
