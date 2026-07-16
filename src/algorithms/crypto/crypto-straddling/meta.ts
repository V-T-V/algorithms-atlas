// 跨越式棋盘密码 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-straddling',
  categoryId: 'crypto',
  title: { zh: '跨越式棋盘密码', en: 'Straddling Checkerboard Cipher' },
  summary: {
    zh: '不规则的 3 行棋盘：首行 8 个常用字母为 1 位码，其余为 2 位码。',
    en: 'An irregular 3-row checkerboard: 8 common letters map to 1-digit codes, the rest to 2-digit codes.',
  },
  description: {
    zh: '常用字母（ETAOIN 等）编 0–7；剩余 18 个字母排进第 2、3 行，编码为首行空缺的两个数字开头。',
    en: 'Frequent letters (ETAOIN...) coded 0–7; remaining 18 fill rows 2–3 prefixed by two unused digits.',
  },
  tags: ['crypto', 'substitution', 'checkerboard'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};
