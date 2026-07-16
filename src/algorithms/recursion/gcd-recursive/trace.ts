// 递归欧几里得 GCD · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gcdRecursive, type GcdRecursiveHooks } from './impl.ts';

export const DEFAULT_INPUT = { a: 252, b: 105 };

export function buildTrace(input: { a: number; b: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { a, b } = input;
  const stack: Array<{ a: number; b: number; depth: number }> = [];
  let resultVal = 0;

  const render = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setAux([
        { label: '初始 a', value: String(a), role: 'pivot' as BarRole },
        { label: '初始 b', value: String(b), role: 'pivot' as BarRole },
        ...stack.map((s) => ({
          label: `depth ${s.depth}`,
          value: `gcd(${s.a}, ${s.b})`,
          role: 'compare' as BarRole,
        })),
      ])
      .commit();
  };

  render({ zh: `计算 gcd(${a}, ${b})`, en: `Compute gcd(${a}, ${b})` });

  const hooks: GcdRecursiveHooks = {
    onRecurse: (aa, bb, depth) => {
      stack.push({ a: aa, b: bb, depth });
      render({ zh: `进入 gcd(${aa}, ${bb})`, en: `Enter gcd(${aa}, ${bb})` });
    },
    onBase: (aa, depth) => {
      render({ zh: `b=0 → 基例返回 ${aa}`, en: `b=0 → base case returns ${aa}` });
      void depth;
    },
    onReturn: (aa, bb, depth) => {
      // 弹出当前层
      const idx = stack.findIndex((s) => s.depth === depth);
      if (idx >= 0) stack.splice(idx, 1);
      render({ zh: `gcd(${aa}, ${bb}) 返回`, en: `gcd(${aa}, ${bb}) returns` });
    },
  };

  resultVal = gcdRecursive(a, b, hooks);

  rec
    .begin({ zh: `gcd(${a}, ${b}) = ${resultVal}`, en: `gcd(${a}, ${b}) = ${resultVal}` })
    .setAux([{ label: '结果', value: String(resultVal), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
