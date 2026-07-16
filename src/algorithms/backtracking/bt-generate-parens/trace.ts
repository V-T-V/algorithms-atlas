import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { generateParenthesis } from './impl.ts';
export const DEFAULT_N = 3;
export function buildTrace(n: number = DEFAULT_N): Frame[] {
  const rec = new TraceRecorder();
  const cur: string[] = [];
  rec.begin({ zh: n + ' 对括号', en: n + ' pairs' }).commit();
  generateParenthesis(n, {
    onAdd: (ch) => {
      cur.push(ch);
      rec
        .begin({ zh: '加 ' + ch, en: 'add ' + ch })
        .setAux([{ label: 'cur', value: cur.join(''), role: 'pivot' as BarRole }])
        .commit();
    },
    onResult: (s) =>
      rec
        .begin({ zh: s, en: s })
        .setBars([{ value: s.length, role: 'final' as BarRole, label: s }])
        .commit(),
  });
  rec.begin({ zh: '完成', en: 'Done' }).commit();
  return rec.build();
}
