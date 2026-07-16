// 批量梯度下降（动量 + 裁剪）· 模块入口（懒加载）

import type { Demo } from '../../../types.ts';
import { buildTrace } from './trace.ts';

export { meta } from './meta.ts';

export async function createDemo(): Promise<Demo> {
  const { meta } = await import('./meta.ts');
  return { meta, buildTrace };
}
