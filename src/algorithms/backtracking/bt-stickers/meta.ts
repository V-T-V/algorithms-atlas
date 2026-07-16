// 贴纸拼词 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-stickers',
  categoryId: 'backtracking',
  title: { zh: '贴纸拼词', en: 'Stickers to Spell Word' },
  summary: { zh: '用最少贴纸拼出目标词（回溯+剪枝）。', en: 'Min stickers to spell target word.' },
  description: { zh: '回溯枚举每张贴纸的取用。', en: 'Backtrack over sticker choices. O(n^m).' },
  tags: ['backtracking', 'string'],
  complexity: { time: 'O(n^m)', space: 'O(m)' },
};
