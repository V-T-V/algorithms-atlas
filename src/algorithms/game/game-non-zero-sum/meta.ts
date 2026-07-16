// 非零和博弈 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-non-zero-sum',
  categoryId: 'game',
  title: { zh: '非零和博弈', en: 'Non-Zero-Sum Game' },
  summary: {
    zh: '双方收益之和非常数；可存在双赢或多重均衡。',
    en: 'Sum of payoffs is non-constant; allows win-win or multiple equilibria.',
  },
  description: {
    zh: '非零和博弈示例。\n      A      B\n  A  3,2    1,4\n  B  2,1    4,3\n收益和非常数：(A,A)=5、(A,B)=5、(B,A)=3、(B,B)=7。',
    en: 'Non-zero-sum example.\n      A      B\n  A  3,2    1,4\n  B  2,1    4,3\nNon-constant payoff sums: (A,A)=5, (A,B)=5, (B,A)=3, (B,B)=7.',
  },
  tags: ['game', 'game-theory', 'matrix'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
