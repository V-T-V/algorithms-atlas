// 视图助手（View Helper）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'design-view-helper',
  categoryId: 'design',
  title: { zh: '视图助手', en: 'View Helper' },
  summary: { zh: '视图与业务逻辑分离的助手。', en: 'Helpers separating view from logic.' },
  description: {
    zh: '视图助手模式把视图中不该有的格式化、国际化和业务逻辑抽到 helper 类/函数，保持视图纯展示。',
    en: 'The View Helper pattern pulls formatting, i18n and business logic out of the view into helper classes/functions, keeping views presentation-only.',
  },
  tags: ['design', 'pattern', 'view-helper', 'architectural'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
