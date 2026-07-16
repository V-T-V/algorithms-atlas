// =============================================================================
// Heun 方法 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { heunMethod, type HeunHooks } from './impl.ts';

export const DEFAULT_INPUT = { x0: 0, y0: 1, xEnd: 2, h: 0.5 };

export function buildTrace(input?: {
  x0?: number;
  y0?: number;
  xEnd?: number;
  h?: number;
}): Frame[] {
  const { x0 = 0, y0 = 1, xEnd = 2, h = 0.5 } = input ?? {};
  const rec = new TraceRecorder();
  const f = (x: number, y: number): number => {
    void x;
    return y;
  };
  const ys: number[] = [y0];

  const snapshot = (
    note: { zh: string; en: string },
    ks?: { k1: number; yStar: number; k2: number },
  ): void => {
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: '步数', value: String(ys.length - 1), role: 'pivot' as BarRole },
    ];
    if (ks) {
      aux.push(
        { label: 'k1', value: ks.k1.toFixed(4), role: 'compare' as BarRole },
        { label: 'y*（预测）', value: ks.yStar.toFixed(4), role: 'frontier' as BarRole },
        { label: 'k2', value: ks.k2.toFixed(4), role: 'compare' as BarRole },
      );
    }
    rec
      .begin(note)
      .setBars(
        ys.map((v, i) => ({
          value: v,
          role: i === ys.length - 1 ? ('pivot' as BarRole) : ('default' as BarRole),
          label: v.toFixed(3),
        })),
      )
      .setAux(aux)
      .commit();
  };

  snapshot({ zh: `初值 y(${x0}) = ${y0}，方程 y'=y`, en: `Initial y(${x0}) = ${y0}, ODE y'=y` });

  const hooks: HeunHooks = {
    onStep: (step, x, y, k1, yStar, k2) => {
      ys.push(y);
      snapshot(
        {
          zh: `第 ${step} 步：y(${x.toFixed(2)}) ≈ ${y.toFixed(4)}（精确 e^x = ${Math.exp(x).toFixed(4)}）`,
          en: `Step ${step}: y(${x.toFixed(2)}) ≈ ${y.toFixed(4)} (exact e^x = ${Math.exp(x).toFixed(4)})`,
        },
        { k1, yStar, k2 },
      );
    },
  };

  void heunMethod(f, x0, y0, xEnd, h, hooks);

  rec
    .begin({ zh: '完成（对比精确解 e^x）', en: 'Done (compare to exact e^x)' })
    .setBars(ys.map((v) => ({ value: v, role: 'final' as BarRole, label: v.toFixed(3) })))
    .commit();

  return rec.build();
}
