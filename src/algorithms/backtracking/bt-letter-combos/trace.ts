import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { letterCombinations } from './impl.ts';
export const DEFAULT_DIGITS = '23';
export function buildTrace(digits: string = DEFAULT_DIGITS): Frame[] {
  const rec = new TraceRecorder();
  const cur: string[] = [];
  rec.begin({ zh: '"' + digits + '" 字母组合', en: 'Combos of ' + digits }).commit();
  letterCombinations(digits, {
    onPick: (ch, idx) => {
      cur[idx] = ch;
      rec
        .begin({ zh: '选 ' + ch, en: 'pick ' + ch })
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
