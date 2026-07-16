import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { HomePage, AboutPage, render, type PageController } from './impl.ts';
export const DEFAULT_INPUT: any = [
  ['home', 'x'],
  ['about', 'me'],
];
export function buildTrace(input: string[][] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '页面控制器', en: 'Page Controller' }).commit();
  const pages: Record<string, PageController> = { home: new HomePage(), about: new AboutPage() };
  for (const [name, req] of input) {
    const pc = pages[name!]!;
    render(pc, name!, req!, {
      onRender: (p, html) =>
        rec
          .begin({ zh: p + ' -> ' + html, en: 'render' })
          .setAux([{ label: 'page', value: p, role: 'compare' as BarRole }])
          .commit(),
    });
  }
  rec
    .begin({ zh: '完成', en: 'done' })
    .setAux([{ label: 'done', value: 'ok', role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
