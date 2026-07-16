// 角色对象模式（Role Object）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'design-role-object',
  categoryId: 'design',
  title: { zh: '角色对象模式', en: 'Role Object' },
  summary: { zh: '按角色动态挂载接口。', en: 'Dynamically attach role-specific interfaces.' },
  description: {
    zh: '角色对象模式让一个核心对象按需动态获得不同角色接口(如 Customer 同时是 Buyer 和 Payer)，避免巨型类。',
    en: 'The Role Object pattern lets a core object dynamically acquire role-specific interfaces (Customer as Buyer, Payer), avoiding god classes.',
  },
  tags: ['design', 'pattern', 'role-object', 'structural'],
  complexity: { time: 'O(1)', space: 'O(r)' },
};
