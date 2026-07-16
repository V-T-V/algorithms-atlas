// 组合视图（Composite View）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'design-composite-view',
  categoryId: 'design',
  title: { zh: '组合视图', en: 'Composite View' },
  summary: { zh: '由多个子视图组合成页面。', en: 'Page composed of sub-views.' },
  description: {
    zh: '组合视图模式把页面拆成可复用的子视图(页眉、列表、页脚)再组合，类似复合组件，提高复用与一致性。',
    en: 'The Composite View pattern splits a page into reusable sub-views (header, list, footer) then composes them, improving reuse and consistency.',
  },
  tags: ['design', 'pattern', 'composite-view', 'architectural'],
  complexity: { time: 'O(v)', space: 'O(v)' },
};
