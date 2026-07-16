// =============================================================================
// 阿克曼函数 · 录制帧序列
// 用 setAux 展示调用栈深度、调用次数与返回值轨迹，用 setBars 展示各 (m,n) 返回值。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ackermannWithStats, type AckermannHooks } from './impl.ts';

export const DEFAULT_INPUT = { m: 2, n: 3 };

/** 录制演示帧序列。 */
export function buildTrace(input: { m: number; n: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { m, n } = input;

  // 调用栈：记录 (m,n) 对
  const callStack: Array<{ m: number; n: number }> = [];
  let maxDepth = 0;
  let callCount = 0;
  let lastReturn: { m: number; n: number; v: number } | null = null;
  // 记录已算出的「叶子」返回值（用于 bars 展示）
  const returns: Array<{ m: number; n: number; v: number }> = [];

  const render = (note: { zh: string; en: string }): void => {
    const stackStr = callStack.map((c) => `A(${c.m},${c.n})`).join(' → ');
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: '调用栈', value: stackStr || '∅', role: 'pivot' as BarRole },
      { label: '栈深', value: String(callStack.length), role: 'frontier' as BarRole },
      { label: '最大深度', value: String(maxDepth), role: 'compare' as BarRole },
      { label: '调用次数', value: String(callCount), role: 'swap' as BarRole },
    ];
    if (lastReturn) {
      aux.push({
        label: '刚返回',
        value: `A(${lastReturn.m},${lastReturn.n})=${lastReturn.v}`,
        role: 'final' as BarRole,
      });
    }
    // bars：展示最近的若干个返回值（最多 12 个）
    const recent = returns.slice(-12);
    const bars = recent.map((r, i) => ({
      value: Math.min(r.v, 50),
      role: (i === recent.length - 1 ? 'pivot' : 'final') as BarRole,
      label: `A(${r.m},${r.n})=${r.v}`,
    }));

    rec.begin(note).setBars(bars).setAux(aux).commit();
    lastReturn = null;
  };

  render({
    zh: `计算 A(${m}, ${n})：经典双递归，调用次数将远超直觉`,
    en: `Compute A(${m}, ${n}): nested recursion; call count will far exceed intuition`,
  });

  const hooks: AckermannHooks = {
    onCall: (mm, nn, depth) => {
      callStack.push({ m: mm, n: nn });
      callCount++;
      maxDepth = Math.max(maxDepth, depth + 1);
      // 只在浅层（深度 ≤ 3）逐帧，避免帧数爆炸
      if (depth <= 3) {
        render({
          zh: `调用 A(${mm}, ${nn})（深度 ${depth}）`,
          en: `Call A(${mm}, ${nn}) (depth ${depth})`,
        });
      }
    },
    onReturn: (mm, nn, v, depth) => {
      callStack.pop();
      returns.push({ m: mm, n: nn, v });
      lastReturn = { m: mm, n: nn, v };
      if (depth <= 2) {
        render({
          zh: `返回 A(${mm}, ${nn}) = ${v}`,
          en: `Return A(${mm}, ${nn}) = ${v}`,
        });
      }
    },
  };

  const { value, stats } = ackermannWithStats(m, n, hooks);

  // 终态
  rec
    .begin({ zh: `完成：A(${m}, ${n}) = ${value}`, en: `Done: A(${m}, ${n}) = ${value}` })
    .setBars([
      { value: Math.min(value, 50), role: 'final' as BarRole, label: `A(${m},${n})=${value}` },
    ])
    .setAux([
      { label: '结果', value: `A(${m}, ${n}) = ${value}`, role: 'final' as BarRole },
      { label: '总调用次数', value: String(stats.calls), role: 'warn' as BarRole },
      { label: '最大栈深', value: String(stats.maxDepth), role: 'frontier' as BarRole },
      { label: '复杂度', value: 'O(A(m,n)) 时间', role: 'compare' as BarRole },
    ])
    .commit();

  return rec.build();
}
