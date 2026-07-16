import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { renderPage } from './impl.ts';
export const DEFAULT_INPUT: any = { title: 'Home', slots: { main: 'welcome', side: 'menu' } };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '模板布局', en: 'Layout' }).commit();
  const html = renderPage(input.title, input.slots, {
    onSlot: (k, v) =>
      rec
        .begin({ zh: '槽 ' + k, en: 'slot' })
        .setAux([
          { label: 'slot', value: k, role: 'compare' as BarRole },
          { label: 'content', value: v, role: 'final' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: html.length + ' 字符', en: 'chars' })
    .setAux([{ label: 'chars', value: String(html.length), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
