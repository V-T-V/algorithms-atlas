// 两步视图（Two Step View）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'design-two-step-view',
  categoryId: 'design',
  title: { zh: '两步视图', en: 'Two Step View' },
  summary: { zh: '先转逻辑视图再转展示。', en: 'Domain to logical, then logical to display.' },
  description: {
    zh: '两步视图先把领域数据转成逻辑 DOM(与主题无关)，再用主题/皮肤渲染成 HTML，便于多主题切换。',
    en: 'The Two Step View first converts domain data to a theme-neutral logical DOM, then renders to HTML per theme, easing multi-theme support.',
  },
  tags: ['design', 'pattern', 'two-step-view', 'architectural'],
  complexity: { time: 'O(n)', space: 'O(n)' },
};
