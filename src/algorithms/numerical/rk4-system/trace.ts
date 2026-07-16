// =============================================================================
// RK4 方程组 · 录制帧序列
// 解 Lotka-Volterra 捕食者-猎物模型。
//   dx/dt = αx - βxy
//   dy/dt = δxy - γy
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rk4System, type RK4SystemHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  x0: 0,
  y0: [40, 9], // 猎物、捕食者
  xEnd: 10,
  h: 0.5,
  alpha: 1.1,
  beta: 0.4,
  delta: 0.1,
  gamma: 0.4,
};

export function buildTrace(input?: typeof DEFAULT_INPUT): Frame[] {
  const { x0, y0, xEnd, h, alpha, beta, delta, gamma } = input ?? DEFAULT_INPUT;
  const rec = new TraceRecorder();

  const F = (_x: number, y: number[]): number[] => {
    const [prey, pred] = y;
    return [alpha * prey! - beta * prey! * pred!, delta * prey! * pred! - gamma * pred!];
  };

  const states: Array<{ x: number; y: number[] }> = [{ x: x0, y: [...y0] }];

  const snapshot = (note: { zh: string; en: string }): void => {
    // 用 bars 同时展示猎物与捕食者
    const last = states[states.length - 1]!;
    rec
      .begin(note)
      .setBars(
        last.y.map((v, i) => ({
          value: v,
          role: i === 0 ? ('frontier' as BarRole) : ('compare' as BarRole),
          label: i === 0 ? `猎物 ${v.toFixed(2)}` : `捕食者 ${v.toFixed(2)}`,
        })),
      )
      .setAux([
        { label: 't', value: last.x.toFixed(2), role: 'pivot' as BarRole },
        { label: '猎物', value: last.y[0]!.toFixed(3), role: 'frontier' as BarRole },
        { label: '捕食者', value: last.y[1]!.toFixed(3), role: 'compare' as BarRole },
      ])
      .commit();
  };

  snapshot({
    zh: `初值：猎物=${y0[0]}, 捕食者=${y0[1]}`,
    en: `Initial: prey=${y0[0]}, predator=${y0[1]}`,
  });

  const hooks: RK4SystemHooks = {
    onStep: (_step, x, y) => {
      states.push({ x, y: [...y] });
      snapshot({
        zh: `t=${x.toFixed(2)}：猎物=${y[0]!.toFixed(3)}，捕食者=${y[1]!.toFixed(3)}`,
        en: `t=${x.toFixed(2)}: prey=${y[0]!.toFixed(3)}, predator=${y[1]!.toFixed(3)}`,
      });
    },
  };

  void rk4System(F, x0, y0, xEnd, h, hooks);

  rec
    .begin({ zh: '完成（Lotka-Volterra 周期演化）', en: 'Done (Lotka-Volterra cycle)' })
    .setBars(
      states[states.length - 1]!.y.map((v, i) => ({
        value: v,
        role: 'final' as BarRole,
        label: i === 0 ? `猎物 ${v.toFixed(2)}` : `捕食者 ${v.toFixed(2)}`,
      })),
    )
    .commit();

  return rec.build();
}
