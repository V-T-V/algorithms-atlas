import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { twoStep, type Logical } from './impl.ts';
const toL = (r: { name: string }): Logical => ({ tag: 'h1', text: r.name });
const theme = (l: Logical): string => '<' + l.tag + '>' + l.text + '</' + l.tag + '>';
export const DEFAULT_INPUT: any = [{ name: 'Ann' }, { name: 'Bob' }];
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '两步视图', en: 'Two Step' }).commit();
  const html = twoStep(input, toL, theme, {
    onLogical: (i, l) =>
      rec
        .begin({ zh: '逻辑 ' + l.tag + ':' + l.text, en: 'logical' })
        .setAux([{ label: 'i', value: String(i), role: 'compare' as BarRole }])
        .commit(),
    onRender: (h) =>
      rec
        .begin({ zh: '渲染 ' + h.length + ' 字符', en: 'render' })
        .setAux([{ label: 'len', value: String(h.length), role: 'final' as BarRole }])
        .commit(),
  });
  void html;
  return rec.build();
}
