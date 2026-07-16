import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, findMiddle } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, 4, 5];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  rec
    .begin({ zh: '找中点', en: 'Find middle' })
    .setArray(
      [...input],
      input.map(() => 'default' as BarRole),
      [],
    )
    .commit();
  const mid = findMiddle(head, {
    onStep: (v) =>
      rec
        .begin({ zh: 'slow 走到 ' + v, en: 'slow at ' + v })
        .setArray(
          [...input],
          input.map(() => 'default' as BarRole),
          [],
        )
        .commit(),
  });
  rec
    .begin({ zh: '中点 = ' + (mid?.value ?? null), en: 'mid = ' + (mid?.value ?? null) })
    .setAux([{ label: 'mid', value: String(mid?.value ?? null), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
