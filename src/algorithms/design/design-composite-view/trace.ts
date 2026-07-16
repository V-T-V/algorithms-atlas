import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { LeafView, CompositeView, type View } from './impl.ts';
export const DEFAULT_INPUT: any = null;
export function buildTrace(_input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '组合视图', en: 'Composite View' }).commit();
  const page = new CompositeView();
  const parts: View[] = [
    new LeafView('<header>'),
    new LeafView('<list>'),
    new LeafView('<footer>'),
  ];
  for (const v of parts) {
    page.add(v);
    rec
      .begin({ zh: '加子视图', en: 'add' })
      .setAux([{ label: 'kid', value: v.render(), role: 'compare' as BarRole }])
      .commit();
  }
  const html = page.render();
  rec
    .begin({ zh: html.split('\n').length + ' 段', en: 'segments' })
    .setAux([
      { label: 'segments', value: String(html.split('\n').length), role: 'final' as BarRole },
    ])
    .commit();
  return rec.build();
}
