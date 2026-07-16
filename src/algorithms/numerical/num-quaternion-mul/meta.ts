// 四元数乘法 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'num-quaternion-mul',
  categoryId: 'numerical',
  title: { zh: '四元数乘法', en: 'Quaternion Multiplication' },
  summary: { zh: 'Hamilton 积四元数乘法。', en: 'Hamilton product of two quaternions.' },
  description: {
    zh: '用于 3D 旋转的无万向锁表示。',
    en: 'Gimbal-lock-free representation of 3D rotations.',
  },
  tags: ['numerical', 'quaternion'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};
