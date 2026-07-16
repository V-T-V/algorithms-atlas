// =============================================================================
// 阶乘 · 录制帧序列
// 用 setBars 展示从 1 累乘到 n 的中间结果，用 setAux 展示调用栈深度与回归值。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { factorial, type FactorialHooks } from './impl.ts';

export const DEFAULT_INPUT = 6;

/** 录制演示帧序列。 */
export function buildTrace(n: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  // 中间积分数组：[1!, 2!, ..., n!]（按递归返回顺序填充）
  const products: Array<{ k: number; v: number }> = [];
  // 调用栈：栈顶 = 当前正在执行的 n
  const callStack: number[] = [];
  let maxDepth = 0;
  let lastReturned: { k: number; v: number } | null = null;

  const render = (note: { zh: string; en: string }): void => {
    // bars：把 0..n 的阶乘值画出（已算出的标 final，正在算的标 pivot）
    const known = new Map<number, number>(products.map((p) => [p.k, p.v]));
    const bars = Array.from({ length: n + 1 }, (_, k) => {
      const v = known.get(k);
      const role: BarRole = v === undefined ? 'default' : k === lastReturned?.k ? 'pivot' : 'final';
      return { value: v ?? 0, role, label: `${k}!=${v ?? '?'}` };
    });

    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      {
        label: '调用栈',
        value: callStack.length ? `[${callStack.join(',')}]` : '∅',
        role: 'pivot' as BarRole,
      },
      { label: '栈深', value: String(callStack.length), role: 'frontier' as BarRole },
      { label: '最大深度', value: String(maxDepth), role: 'compare' as BarRole },
    ];
    if (lastReturned) {
      aux.push({
        label: '刚返回',
        value: `${lastReturned.k}! = ${lastReturned.v}`,
        role: 'final' as BarRole,
      });
    }

    rec.begin(note).setBars(bars).setAux(aux).commit();
    lastReturned = null;
  };

  render({
    zh: `计算 ${n}!，递归基线 0!=1`,
    en: `Compute ${n}!, base case 0!=1`,
  });

  const hooks: FactorialHooks = {
    onRecurse: (k, depth) => {
      callStack.push(k);
      maxDepth = Math.max(maxDepth, depth + 1);
      render({
        zh: `进入 factorial(${k})，当前栈 [${callStack.join(',')}]`,
        en: `Enter factorial(${k}); stack [${callStack.join(',')}]`,
      });
    },
    onBase: (k) => {
      products.push({ k, v: 1 });
      lastReturned = { k, v: 1 };
      render({
        zh: `基线：factorial(${k}) = 1`,
        en: `Base: factorial(${k}) = 1`,
      });
    },
    onReturn: (k, v) => {
      callStack.pop();
      products.push({ k, v });
      lastReturned = { k, v };
      render({
        zh: `返回：factorial(${k}) = ${v}`,
        en: `Return: factorial(${k}) = ${v}`,
      });
    },
  };

  const result = factorial(n, hooks);

  // 终态
  rec
    .begin({ zh: `完成：${n}! = ${result}`, en: `Done: ${n}! = ${result}` })
    .setBars(
      Array.from({ length: n + 1 }, (_, k) => {
        const v = products.find((p) => p.k === k)?.v ?? 0;
        return { value: v, role: 'final' as BarRole, label: `${k}!=${v}` };
      }),
    )
    .setAux([
      { label: '结果', value: `${n}! = ${result}`, role: 'final' as BarRole },
      { label: '最大栈深', value: String(maxDepth), role: 'frontier' as BarRole },
      { label: '复杂度', value: '时间 O(n)，空间 O(n)', role: 'compare' as BarRole },
    ])
    .commit();

  return rec.build();
}
