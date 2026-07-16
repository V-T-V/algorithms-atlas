// 翻转游戏 II · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'bt-flip-game-2',
  categoryId: 'backtracking',
  title: { zh: '翻转游戏 II', en: 'Flip Game II' },
  summary: {
    zh: '回溯 + SG 值判断 ++ 字符串先手能否必胜。',
    en: 'Backtracking with SG values to decide if the first player wins the flip game.',
  },
  description: {
    zh: '两人轮流把 "++" 翻成 "--"，不能翻者输。用 Sprague-Grundy：sg[i]=mex{sg[i-2-j] xor sg[j]}。',
    en: 'Players alternately flip "++" to "--". Sprague-Grundy: sg[i]=mex{sg[i-2-j] xor sg[j]}. First player wins iff sg[n]≠0.',
  },
  tags: ['backtracking', 'game-theory', 'sprague-grundy'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};
