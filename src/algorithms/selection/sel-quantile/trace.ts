import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { quantile } from './impl.ts';

export const DEFAULT_INPUT = { arr: Array.from({ length: 20 }, (_, i) => i + 1), q: 4 };

export function buildTrace(input: { arr: number[]; q: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { arr, q } = input;
  const sorted = [...arr].sort((a, b) => a - b);

  rec
    .begin({
      zh: `排序数据 n=${sorted.length}，分 ${q} 份`,
      en: `Sorted n=${sorted.length}, ${q} parts`,
    })
    .setBars(rec.barsFrom(sorted))
    .setAux([{ label: 'q', value: q.toString(), role: 'compare' as BarRole }])
    .commit();

  const cuts = quantile(arr, q);

  rec
    .begin({ zh: `完成：${cuts.length} 个切点`, en: `Done: ${cuts.length} cuts` })
    .setBars(
      sorted.map((v) => ({
        value: v,
        role: (cuts.includes(v) ? 'final' : 'default') as BarRole,
        label: String(v),
      })),
    )
    .setAux(
      cuts.map((c, i) => ({
        label: `切点${i + 1}`,
        value: c.toString(),
        role: 'final' as BarRole,
      })),
    )
    .commit();
  return rec.build();
}
