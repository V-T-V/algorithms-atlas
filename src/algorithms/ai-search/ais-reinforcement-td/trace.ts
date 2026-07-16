// TD(0) 策略评估 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { tdZero, type TdDomain } from './impl.ts';

export const DEFAULT_INPUT = { gamma: 0.9, alpha: 0.1, episodes: 30 };

/** 简单两状态 MRP：0 -[r=1]-> 1(终态)；起始恒为 0。 */
function makeDomain(): TdDomain {
  return {
    states: [0, 1],
    start: () => 0,
    step: () => [1, 1, true] as const,
  };
}

export function buildTrace(
  input: { gamma: number; alpha: number; episodes: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { gamma, alpha, episodes } = input;
  const domain = makeDomain();
  const labels = ['s0', 's1'];

  rec
    .begin({ zh: 'TD(0)：初始 V=0', en: 'TD(0): initial V=0' })
    .setBars([0, 0].map((v) => ({ value: v, role: 'default' as BarRole })))
    .setAux([{ label: 'V(s0)', value: '0', role: 'pivot' as BarRole }])
    .commit();

  tdZero(domain, {
    gamma,
    alpha,
    episodes,
    maxSteps: 10,
    rng: (() => {
      let s = 1 >>> 0;
      return () => {
        s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
        return s / 0x100000000;
      };
    })(),
    hooks: {
      onTransition: (s, sNext, r, v) => {
        rec
          .begin({
            zh: `更新 V(s${s})：r=${r}, s′=s${sNext}`,
            en: `Update V(s${s}): r=${r}, s'=s${sNext}`,
          })
          .setBars(
            labels.map((_, i) => ({
              value: Number((i === 0 ? v : 0).toFixed(4)),
              role: 'compare' as BarRole,
              label: `V(s${i})`,
            })),
          )
          .setAux([{ label: `V(s${s})`, value: v.toFixed(4), role: 'final' as BarRole }])
          .commit();
      },
    },
  });

  rec
    .begin({ zh: '收敛：V(s0)→1', en: 'Converged: V(s0)->1' })
    .setBars([1, 0].map((v) => ({ value: v, role: 'final' as BarRole })))
    .setAux([{ label: 'final', value: 'V(s0)=1', role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
