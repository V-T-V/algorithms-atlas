import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { alienOrder } from './impl.ts';
export const DEFAULT_INPUT = ['wrt', 'wrf', 'er', 'ett', 'rftt'];
export function buildTrace(input: string[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '外星人字典', en: 'Alien dictionary' }).commit();
  const order = alienOrder(input, {
    onEdge: (from, to) =>
      rec
        .begin({ zh: '边 ' + from + '→' + to, en: 'edge ' + from + '→' + to })
        .setAux([{ label: 'edge', value: from + '→' + to, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '顺序：' + order, en: 'Order: ' + order })
    .setAux([{ label: 'order', value: order, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
