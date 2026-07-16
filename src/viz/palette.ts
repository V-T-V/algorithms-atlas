// =============================================================================
// 语义色映射：BarRole → CSS 变量名
// 所有 viz 组件共用，保证全局一致的「比较/交换/基准/就位」配色。
// =============================================================================

import type { BarRole } from '../types.ts';

const ROLE_TO_VAR: Record<BarRole, string> = {
  default: '--v-default',
  compare: '--v-compare',
  swap: '--v-swap',
  pivot: '--v-pivot',
  sorted: '--v-sorted',
  frontier: '--v-frontier',
  final: '--v-final',
  warn: '--v-warn',
};

/** 读取某角色对应的 CSS 颜色（运行时取计算值）。 */
export function roleColor(role: BarRole): string {
  const v = ROLE_TO_VAR[role] ?? ROLE_TO_VAR.default;
  return getCssVar(v);
}

export function getCssVar(name: string): string {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export { ROLE_TO_VAR };
