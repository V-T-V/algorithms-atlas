// =============================================================================
// McCarthy 91 函数 · 录制帧序列
// 用 setAux 展示调用链（栈）、当前 n 与返回值，用 setBars 展示当前 n 相对 91/100 的位置。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mccarthy91WithStats, type MccarthyHooks } from './impl.ts';

export const DEFAULT_INPUT = 80;

/** 录制演示帧序列。 */
export function buildTrace(n: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  // 调用栈：记录每一层的 n
  const callStack: number[] = [];
  let maxDepth = 0;
  let callCount = 0;
  let lastReturn: { n: number; v: number } | null = null;
  // 历史返回轨迹（用于 bars 展示）
  const trace: number[] = [];

  const render = (note: { zh: string; en: string }, currentN: number): void => {
    // bars：当前 n 的位置（相对 100 上界）；标 91 为 frontier 参考线
    const top = currentN > 100 ? currentN : 100;
    const bars = [
      { value: 91, role: 'frontier' as BarRole, label: '91 (fixed pt)' },
      {
        value: Math.min(currentN, 120),
        role: (currentN > 100 ? 'swap' : 'pivot') as BarRole,
        label: `n=${currentN}`,
      },
    ];

    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      {
        label: '调用栈',
        value: callStack.length ? `[${callStack.join(',')}]` : '∅',
        role: 'pivot' as BarRole,
      },
      { label: '栈深', value: String(callStack.length), role: 'frontier' as BarRole },
      { label: '最大深度', value: String(maxDepth), role: 'compare' as BarRole },
      { label: '调用次数', value: String(callCount), role: 'swap' as BarRole },
      {
        label: '当前分支',
        value: currentN > 100 ? `n>100 → 返回 ${currentN - 10}` : 'n≤100 → M(M(n+11))',
        role: (currentN > 100 ? 'final' : 'compare') as BarRole,
      },
    ];
    if (lastReturn) {
      aux.push({
        label: '刚返回',
        value: `M(${lastReturn.n}) = ${lastReturn.v}`,
        role: 'final' as BarRole,
      });
    }

    void top;
    rec.begin(note).setBars(bars).setAux(aux).commit();
    lastReturn = null;
  };

  render(
    {
      zh: `计算 M(${n})：对任意 n≤100，结果恒为 91`,
      en: `Compute M(${n}): for any n≤100 the result is always 91`,
    },
    n,
  );

  const hooks: MccarthyHooks = {
    onCall: (nn, depth) => {
      callStack.push(nn);
      callCount++;
      maxDepth = Math.max(maxDepth, depth + 1);
      // 限制帧数：只对深度 ≤ 4 逐帧
      if (depth <= 4) {
        render(
          {
            zh: `调用 M(${nn})${nn > 100 ? '（基线 n>100）' : '（n≤100 → M(M(n+11))）'}`,
            en: `Call M(${nn})${nn > 100 ? ' (base: n>100)' : ' (n≤100 → M(M(n+11)))'}`,
          },
          nn,
        );
      }
    },
    onBase: (nn, v) => {
      if (callStack.length <= 5) {
        render(
          {
            zh: `基线：M(${nn}) = ${v}（n>100，直接返回 n-10）`,
            en: `Base: M(${nn}) = ${v} (n>100, return n-10)`,
          },
          nn,
        );
      }
    },
    onReturn: (nn, v, depth) => {
      callStack.pop();
      trace.push(v);
      lastReturn = { n: nn, v };
      if (depth <= 3) {
        render(
          {
            zh: `返回：M(${nn}) = ${v}`,
            en: `Return: M(${nn}) = ${v}`,
          },
          nn,
        );
      }
    },
  };

  const { value, stats } = mccarthy91WithStats(n, hooks);

  // 终态
  rec
    .begin({
      zh: `完成：M(${n}) = ${value}${n <= 100 ? '（n≤100 → 恒为 91）' : ''}`,
      en: `Done: M(${n}) = ${value}${n <= 100 ? ' (n≤100 → always 91)' : ''}`,
    })
    .setBars([
      { value: 91, role: 'frontier' as BarRole, label: '91 (fixed pt)' },
      { value: value, role: 'final' as BarRole, label: `M(${n})=${value}` },
    ])
    .setAux([
      { label: '结果', value: `M(${n}) = ${value}`, role: 'final' as BarRole },
      { label: '总调用次数', value: String(stats.calls), role: 'swap' as BarRole },
      { label: '最大栈深', value: String(stats.maxDepth), role: 'frontier' as BarRole },
      { label: '不动点', value: 'M(91) = 91', role: 'pivot' as BarRole },
    ])
    .commit();

  return rec.build();
}
