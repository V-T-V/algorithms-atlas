import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { renderView } from './impl.ts';
export const DEFAULT_INPUT: any = { price: 19.5, title: 'A Very Long Product Title' };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '视图助手', en: 'View Helper' }).commit();
  const html = renderView(input.price, input.title, {
    onFormat: (k, o) =>
      rec
        .begin({ zh: k + ' -> ' + o, en: 'format' })
        .setAux([
          { label: 'kind', value: k, role: 'compare' as BarRole },
          { label: 'out', value: o, role: 'final' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: html, en: 'html' })
    .setAux([{ label: 'html', value: html, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
