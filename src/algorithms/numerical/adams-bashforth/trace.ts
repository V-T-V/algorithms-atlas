// =============================================================================
// Adams-Bashforth · 录制帧序列
// 解 y' = y（精确 e^x）。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { adamsBashforth4, type AdamsBashforthHooks } from './impl.ts';

export const DEFAULT_INPUT = { x0: 0, y0: 1, xEnd: 2, h: 0.25 };

export function buildTrace(input?: {
  x0?: number;
  y0?: number;
  xEnd?: number;
  h?: number;
}): Frame[] {
  const { x0 = 0, y0 = 1, xEnd = 2, h = 0.25 } = input ?? {};
  const rec = new TraceRecorder();
  const f = (x: number, y: number): number => {
    void x;
    return y;
  };
  const ys: number[] = [y0];

  const snapshot = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(
        ys.map((v, i) => ({
          value: v,
          role: i === ys.length - 1 ? ('pivot' as BarRole) : ('default' as BarRole),
          label: v.toFixed(3),
        })),
      )
      .setAux([
        { label: '步数', value: String(ys.length - 1), role: 'pivot' as BarRole },
        { label: 'y 值', value: ys[ys.length - 1]!.toFixed(4), role: 'final' as BarRole },
      ])
      .commit();
  };

  snapshot({ zh: `初值 y(${x0}) = ${y0}，方程 y'=y`, en: `Initial y(${x0}) = ${y0}, ODE y'=y` });

  const hooks: AdamsBashforthHooks = {
    onStep: (step, x, y) => {
      ys.push(y);
      snapshot({
        zh: `第 ${step} 步（${step <= 3 ? 'RK4 启动' : 'AB4'}）：y(${x.toFixed(2)}) ≈ ${y.toFixed(4)}（精确 e^x = ${Math.exp(x).toFixed(4)}）`,
        en: `Step ${step} (${step <= 3 ? 'RK4 bootstrap' : 'AB4'}): y(${x.toFixed(2)}) ≈ ${y.toFixed(4)} (exact e^x = ${Math.exp(x).toFixed(4)})`,
      });
    },
  };

  void adamsBashforth4(f, x0, y0, xEnd, h, hooks);

  rec
    .begin({ zh: '完成（对比精确解 e^x）', en: 'Done (compare to exact e^x)' })
    .setBars(ys.map((v) => ({ value: v, role: 'final' as BarRole, label: v.toFixed(3) })))
    .commit();

  return rec.build();
}
