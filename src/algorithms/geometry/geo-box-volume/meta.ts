// 长方体体积 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-box-volume',
  categoryId: 'geometry',
  title: { zh: '长方体体积', en: 'Box Volume' },
  summary: {
    zh: '由三边长求长方体体积。',
    en: 'Volume of a rectangular box given its three side lengths.',
  },
  description: { zh: '体积 = 长 × 宽 × 高。', en: 'Volume = length × width × height.' },
  tags: ['geometry', '3d', 'volume'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
