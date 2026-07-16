// 互递归判奇偶 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isEven, type MutualHooks } from './impl.ts';

export const DEFAULT_INPUT = 5;

export function buildTrace(n: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  // 调用栈：交替的函数名序列
  const callStack: Array<{ fn: 'isEven' | 'isOdd'; n: number }> = [];
  let maxDepth = 0;
  let lastResult: boolean | null = null;
  let lastFn: 'isEven' | 'isOdd' | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    const bars = callStack.map((c, i) => ({
      value: c.n + 1,
      role: (i === callStack.length - 1 ? 'pivot' : 'frontier') as BarRole,
      label: `${c.fn}(${c.n})`,
    }));
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      {
        label: '调用栈',
        value: callStack.map((c) => `${c.fn}(${c.n})`).join('→') || '∅',
        role: 'pivot' as BarRole,
      },
      { label: '栈深', value: String(callStack.length), role: 'frontier' as BarRole },
      { label: '最大深度', value: String(maxDepth), role: 'compare' as BarRole },
    ];
    if (lastFn) {
      aux.push({
        label: '返回',
        value: `${lastFn} → ${lastResult}`,
        role: lastResult ? 'final' : ('warn' as BarRole),
      });
    }
    rec.begin(note).setBars(bars).setAux(aux).commit();
    lastResult = null;
    lastFn = null;
  };

  snapshot({ zh: `判定 ${n} 的奇偶性`, en: `Determine parity of ${n}` });

  const hooks: MutualHooks = {
    onEnter: (fn, k, depth) => {
      callStack.push({ fn, n: k });
      maxDepth = Math.max(maxDepth, depth + 1);
      snapshot({ zh: `进入 ${fn}(${k})`, en: `Enter ${fn}(${k})` });
    },
    onBase: (fn, result) => {
      lastFn = fn;
      lastResult = result;
      snapshot({ zh: `基线 ${fn}(0) = ${result}`, en: `Base ${fn}(0) = ${result}` });
    },
    onReturn: (fn, k, result) => {
      callStack.pop();
      lastFn = fn;
      lastResult = result;
      snapshot({ zh: `返回 ${fn}(${k}) = ${result}`, en: `Return ${fn}(${k}) = ${result}` });
    },
  };

  const result = isEven(n, hooks);

  rec
    .begin({ zh: `isEven(${n}) = ${result}`, en: `isEven(${n}) = ${result}` })
    .setBars([{ value: n + 1, role: 'final' as BarRole, label: `isEven(${n})=${result}` }])
    .setAux([
      { label: '结果', value: String(result), role: 'final' as BarRole },
      { label: '最大栈深', value: String(maxDepth), role: 'frontier' as BarRole },
      { label: '复杂度', value: '时间 O(n)，空间 O(n)', role: 'compare' as BarRole },
    ])
    .commit();

  return rec.build();
}
