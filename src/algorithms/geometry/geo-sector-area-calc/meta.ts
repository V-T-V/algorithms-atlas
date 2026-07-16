// 扇形面积 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'geo-sector-area-calc',
  categoryId: 'geometry',
  title: { zh: '扇形面积', en: 'Sector Area' },
  summary: { zh: '由半径与圆心角求扇形面积。', en: 'Sector area given radius and central angle.' },
  description: { zh: '扇形面积 = ½ r² θ。', en: 'Sector area = ½ r² θ.' },
  tags: ['geometry', 'circle', 'area'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
