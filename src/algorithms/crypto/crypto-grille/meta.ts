// 栅栏转置密码 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-grille',
  categoryId: 'crypto',
  title: { zh: '栅栏转置密码', en: 'Turning Grille Cipher' },
  summary: {
    zh: '4×4 网格上开 4 个孔的卡片，依次旋转 90° 三次各填一组字母，共 16 字符。',
    en: 'A card with 4 holes on a 4×4 grid; rotate 90° three times filling a group each time — 16 chars total.',
  },
  description: {
    zh: '每旋转一次，4 个孔覆盖 4 个新格子；四象限+四方向确保每格恰好被覆盖一次。',
    en: 'Each quarter-turn exposes 4 new cells; the quadrant/direction pattern covers each cell exactly once across 4 positions.',
  },
  tags: ['crypto', 'transposition', 'classical'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
