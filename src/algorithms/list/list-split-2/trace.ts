import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, splitByValue } from './impl.ts';
export const DEFAULT_INPUT = { arr: [4, 1, 3, 2, 5], x: 3 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input.arr);
  rec.begin({ zh: '按 ' + input.x + ' 拆分', en: 'Split by ' + input.x }).commit();
  const [a, b] = splitByValue(head, input.x, {
    onSplit: (v, side) =>
      rec
        .begin({ zh: v + ' → ' + side, en: v + ' → ' + side })
        .setAux([
          {
            label: side,
            value: String(v),
            role: (side === 'lt' ? 'pivot' : 'frontier') as BarRole,
          },
        ])
        .commit(),
  });
  rec
    .begin({
      zh: 'lt: ' + listToArray(a).join(',') + ' | ge: ' + listToArray(b).join(','),
      en: 'split done',
    })
    .commit();
  return rec.build();
}
