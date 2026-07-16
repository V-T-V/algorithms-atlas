// =============================================================================
// 2×N 铺砖 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dominoTiling2xN, type TilingHooks } from './impl.ts';

export const DEFAULT_N = 6;

export function buildTrace(n: number = DEFAULT_N): Frame[] {
  const rec = new TraceRecorder();
  const series: number[] = [];
  let ans = 0;

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(
        series.map((v, i) => ({
          value: v,
          role: (i === series.length - 1 ? 'final' : 'frontier') as BarRole,
        })),
      )
      .setAux([{ label: '序列', value: series.map((v) => `${v}`).join(' '), role: 'pivot' }])
      .commit();
  };

  snap({ zh: `n=${n}`, en: `n=${n}` });

  const hooks: TilingHooks = {
    onStep: (i, w) => {
      series[i] = w;
      snap({ zh: `f(${i})=${w}`, en: `f(${i})=${w}` });
    },
    onDone: (w) => {
      ans = w;
      snap({ zh: `方案数=${w}`, en: `ways=${w}` });
    },
  };

  dominoTiling2xN(n, hooks);

  rec
    .begin({ zh: `完成：${ans}`, en: `Done: ${ans}` })
    .setAux([{ label: 'f(n)', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
