// 页面控制器（Page Controller）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'design-page-controller',
  categoryId: 'design',
  title: { zh: '页面控制器', en: 'Page Controller' },
  summary: { zh: '每页一个控制器对象。', en: 'One controller per page.' },
  description: {
    zh: '页面控制器模式为每个页面/视图分配一个专门控制器处理该页输入与渲染，比单一前端控制器更细粒度。',
    en: 'The Page Controller pattern assigns a dedicated controller per page/view for input handling and rendering; finer-grained than Front Controller.',
  },
  tags: ['design', 'pattern', 'page-controller', 'architectural'],
  complexity: { time: 'O(1)', space: 'O(p)' },
};
