// 模板页面布局（Template Page Layout）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'design-page-template',
  categoryId: 'design',
  title: { zh: '模板页面布局', en: 'Template Page Layout' },
  summary: { zh: '页面共享布局、子页填充内容。', en: 'Shared layout; subpages fill content.' },
  description: {
    zh: '模板页面布局定义共享页头页脚骨架，子页面只填内容槽，避免每页重复写布局结构。',
    en: 'Template Page Layout defines a shared header/footer skeleton; subpages only fill content slots, avoiding repeated layout markup.',
  },
  tags: ['design', 'pattern', 'layout', 'architectural'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
