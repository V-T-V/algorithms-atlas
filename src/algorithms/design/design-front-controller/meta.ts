// 前端控制器（Front Controller）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'design-front-controller',
  categoryId: 'design',
  title: { zh: '前端控制器', en: 'Front Controller' },
  summary: { zh: '单一入口分发所有请求。', en: 'Single entry dispatches all requests.' },
  description: {
    zh: '前端控制器模式用一个控制器接收所有请求，统一鉴权、日志后分发到具体处理器，常见于 Web MVC 框架。',
    en: 'The Front Controller pattern routes all requests through one controller that does auth/logging then dispatches; standard in Web MVC frameworks.',
  },
  tags: ['design', 'pattern', 'front-controller', 'architectural'],
  complexity: { time: 'O(1) per request', space: 'O(h)' },
};
