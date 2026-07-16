// 贴纸拼词 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-stickers-spell',
  categoryId: 'backtracking',
  title: { zh: '贴纸拼词', en: 'Stickers to Spell Word' },
  summary: {
    zh: '回溯 + 记忆化求拼出目标词所需最少贴纸数。',
    en: 'Backtracking with memoization to find minimum stickers to spell a target word.',
  },
  description: {
    zh: '每张贴纸可剪下任意字母。把目标词转化为字符计数，回溯尝试每种贴纸减去字母，记忆已处理子状态。',
    en: 'Each sticker yields any of its letters. Convert target to a letter count, backtrack by applying stickers and memoize remaining states.',
  },
  tags: ['backtracking', 'memoization'],
  complexity: { time: 'O(2^m·n·k)', space: 'O(2^m)' },
};
