import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { proxmapSort, type ProxmapHooks } from './impl.ts';

export const DEFAULT_INPUT = [29, 10, 14, 37, 13, 25, 41, 8, 22, 30];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: `初始：${input.join(', ')}`, en: `Initial: ${input.join(', ')}` })
    .setBars(rec.barsFrom(input))
    .commit();
  let collected: number[] = [];
  const bucketSizes: number[] = new Array(input.length).fill(0);
  const hooks: ProxmapHooks = {
    onHit: (idx) => {
      bucketSizes[idx]!++;
      collected = [];
      for (let i = 0; i < bucketSizes.length; i++) collected.push(bucketSizes[i]!);
      rec
        .begin({ zh: `值落入桶 ${idx}`, en: `Value → bucket ${idx}` })
        .setBars(rec.barsFrom(input))
        .commit();
    },
  };
  const result = proxmapSort(input, hooks);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
