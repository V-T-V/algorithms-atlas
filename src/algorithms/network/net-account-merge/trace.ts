import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { accountsMerge, type Account } from './impl.ts';
export const DEFAULT_INPUT: Account[] = [
  { name: 'John', emails: ['john@mail.com', 'john2@mail.com'] },
  { name: 'John', emails: ['john3@mail.com', 'john@mail.com'] },
  { name: 'Mary', emails: ['mary@mail.com'] },
];
export function buildTrace(input: Account[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '账户合并', en: 'Accounts merge' }).commit();
  const merged = accountsMerge(input, {
    onMerge: (e, r) =>
      rec
        .begin({ zh: e + ' → ' + r, en: e + ' → ' + r })
        .setAux([{ label: 'root', value: r, role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '合并后 ' + merged.length + ' 个账户', en: merged.length + ' accounts' })
    .setAux([{ label: 'count', value: String(merged.length), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
