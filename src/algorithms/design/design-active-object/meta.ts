// 主动对象（Active Object）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'design-active-object',
  categoryId: 'design',
  title: { zh: '主动对象', en: 'Active Object' },
  summary: { zh: '对象拥有自己的执行线程。', en: 'Object has its own thread of execution.' },
  description: {
    zh: '主动对象模式把方法调用与执行解耦：调用入队成 method request，对象内部线程按调度执行并返回 future，使并发对象看起来像顺序的。',
    en: 'The Active Object pattern decouples method invocation from execution: calls enqueue as method requests, an internal thread executes them, returning futures; the object looks sequential.',
  },
  tags: ['design', 'pattern', 'active-object', 'concurrency'],
  complexity: { time: 'O(n)', space: 'O(q)' },
};
