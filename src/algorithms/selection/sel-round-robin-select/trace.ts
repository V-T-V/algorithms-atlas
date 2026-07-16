import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { RoundRobinSelect } from './impl.ts';

export const DEFAULT_ITEMS = ['A', 'B', 'C', 'D'];
export const DEFAULT_N = 8;

export function buildTrace(opts: { items?: string[]; n?: number } = {}): Frame[] {
  const items = opts.items ?? DEFAULT_ITEMS;
  const n = opts.n ?? DEFAULT_N;
  const rec = new TraceRecorder();
  const rr = new RoundRobinSelect(items);

  const snap = (note: { zh: string; en: string }, last: number): void => {
    rec
      .begin(note)
      .setBars(
        rr.counts.map((c, i) => ({
          value: c,
          role: (i === last ? 'final' : 'default') as BarRole,
          label: `${items[i]}:${c}`,
        })),
      )
      .setAux([{ label: '上次选中', value: items[last] ?? '-', role: 'final' as BarRole }])
      .commit();
  };

  snap({ zh: `初始 ${items.length} 项`, en: `Init ${items.length} items` }, -1);

  let last = -1;
  for (let i = 0; i < n; i++) {
    const item = rr.next();
    last = items.indexOf(item);
    snap({ zh: `选 ${item}`, en: `Pick ${item}` }, last);
  }

  rec
    .begin({ zh: '完成：计数均匀', en: 'Done: balanced counts' })
    .setBars(rr.counts.map((c) => ({ value: c, role: 'final' as BarRole, label: String(c) })))
    .setAux([{ label: '计数', value: rr.counts.join(','), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
