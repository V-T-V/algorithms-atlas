// 扩展对象模式（Extension Object）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'design-extension-object',
  categoryId: 'design',
  title: { zh: '扩展对象模式', en: 'Extension Object' },
  summary: { zh: '运行时查询附加接口。', en: 'Query附加 interface at runtime.' },
  description: {
    zh: '扩展对象模式允许在不修改核心类的前提下，按需为对象附加扩展接口，客户端通过类型查询获取扩展。',
    en: 'The Extension Object pattern attaches extension interfaces to a core object at runtime without modifying it; clients query by type.',
  },
  tags: ['design', 'pattern', 'extension-object', 'structural'],
  complexity: { time: 'O(1)', space: 'O(e)' },
};
