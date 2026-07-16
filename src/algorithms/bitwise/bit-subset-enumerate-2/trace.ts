import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { enumerateSubsets } from './impl.ts';
const b = (n: number): string => (n >>> 0).toString(2);
export const DEFAULT_INPUT = [0b1011, 0b111];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '子集枚举', en: 'Subset enumeration' }).commit();
  for (const mask of input) {
    const subs = enumerateSubsets(mask);
    rec
      .begin({
        zh: 'mask=' + b(mask) + ' 共 ' + subs.length + ' 个子集',
        en: 'mask=' + b(mask) + ' has ' + subs.length + ' subsets',
      })
      .setBars(subs.map((s) => ({ value: s, role: 'final' as BarRole, label: b(s) })))
      .commit();
  }
  return rec.build();
}
