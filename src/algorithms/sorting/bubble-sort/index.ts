// 冒泡排序（Bubble Sort）· 模块入口（懒加载）
// meta 单独放 meta.ts（静态收集进首包），本文件仅演示代码，按需分块。

import type { Demo } from '../../../types.ts';
import { buildTrace } from './trace.ts';

export { meta } from './meta.ts';

export async function createDemo(): Promise<Demo> {
  const { meta } = await import('./meta.ts');
  return { meta, buildTrace };
}
