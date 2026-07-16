// 龙格-库塔 RK4 · 录制帧序列
// 解 y'=y（指数增长），用 setBars 展示 y 值序列 + setAux 展示 k1~k4。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rungeKutta4, type RK4Hooks } from './impl.ts';

export const DEFAULT_INPUT = { x0: 0, y0: 1, xEnd: 2, h: 0.5, f: 'exp' };

export function buildTrace(input?: {
  x0?: number;
  y0?: number;
  xEnd?: number;
  h?: number;
}): Frame[] {
  const { x0 = 0, y0 = 1, xEnd = 2, h = 0.5 } = input ?? {};
  const rec = new TraceRecorder();
  // 演示方程：y' = y（精确解 y = e^x）
  const f = (x: number, y: number): number => {
    void x;
    return y;
  };

  const snapshot = (note: { zh: string; en: string }, _ys: number[] = [], ks?: number[]) => {
    const aux = [{ label: '步数 / steps', value: String(ys.length - 1), role: 'pivot' as BarRole }];
    if (ks) {
      aux.push(
        { label: 'k1', value: ks[0]!.toFixed(4), role: 'compare' as BarRole },
        { label: 'k2', value: ks[1]!.toFixed(4), role: 'compare' as BarRole },
        { label: 'k3', value: ks[2]!.toFixed(4), role: 'compare' as BarRole },
        { label: 'k4', value: ks[3]!.toFixed(4), role: 'compare' as BarRole },
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

  const ys: number[] = [y0];
  snapshot({ zh: `初值 y(${x0}) = ${y0}，方程 y'=y`, en: `Initial y(${x0}) = ${y0}, ODE y'=y` });

  const hooks: RK4Hooks = {
    onStep: (step, x, y, k1, k2, k3, k4) => {
      ys.push(y);
      snapshot(
        {
          zh: `第 ${step} 步：y(${x.toFixed(1)}) ≈ ${y.toFixed(4)}（精确 e^x = ${Math.exp(x).toFixed(4)}）`,
          en: `Step ${step}: y(${x.toFixed(1)}) ≈ ${y.toFixed(4)} (exact e^x = ${Math.exp(x).toFixed(4)})`,
        },
        ys,
        [k1, k2, k3, k4],
      );
    },
  };

  void rungeKutta4(f, x0, y0, xEnd, h, hooks);

  rec
    .begin({ zh: '完成（对比精确解 e^x）', en: 'Done (compare to exact e^x)' })
    .setBars(ys.map((v) => ({ value: v, role: 'final' as BarRole, label: v.toFixed(3) })))
    .commit();

  return rec.build();
}
