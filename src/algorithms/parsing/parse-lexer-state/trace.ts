import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { StatefulLexer } from './impl.ts';

export const DEFAULT_INPUT = 'foo(1) "hi" bar';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const rules = {
    INIT: [
      { re: /[A-Za-z_]\w*/g, type: 'ID' },
      { re: / d+/g, type: 'NUM' },
      { re: /[()]/g, type: 'PUNCT' },
      { re: /"/g, type: 'QUOTE', pushState: 'STR' },
      { re: / s+/g, type: 'SKIP' },
    ],
    STR: [
      { re: /[^"]+/g, type: 'STRTEXT' },
      { re: /"/g, type: 'QUOTE', popState: true },
    ],
  };
  const lex = new StatefulLexer(rules, {
    onToken: (t, st) =>
      rec
        .begin({ zh: `${t.type}: "${t.value}" @${st}`, en: `${t.type}: "${t.value}" @${st}` })
        .setAux([
          { label: 'type', value: t.type, role: 'pivot' as BarRole },
          { label: 'value', value: t.value, role: 'frontier' as BarRole },
          { label: 'state', value: st, role: 'compare' as BarRole },
        ])
        .commit(),
    onStateChange: (s) =>
      rec
        .begin({ zh: `切换状态 → ${s}`, en: `enter state ${s}` })
        .setAux([{ label: 'state', value: s, role: 'final' as BarRole }])
        .commit(),
  });
  lex.lex(input);
  return rec.build();
}
