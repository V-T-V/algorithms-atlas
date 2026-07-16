// 斐波那契取模·矩阵快速幂 · 模块入口
import type { Demo } from '../../../types.ts';
import { buildTrace } from './trace.ts';

export { meta } from './meta.ts';

export async function createDemo(): Promise<Demo> {
  const { meta } = await import('./meta.ts');
  return { meta, buildTrace };
}
