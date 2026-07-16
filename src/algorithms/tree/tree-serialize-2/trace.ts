import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, serialize } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3, null, null, 4, 5];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '序列化', en: 'Serialize' }).commit();
  const s = serialize(root, {
    onVisit: (v) =>
      rec
        .begin({ zh: '写 ' + (v ?? 'null'), en: 'write ' + (v ?? 'null') })
        .setAux([{ label: 'token', value: String(v), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '结果：' + s, en: 'Result: ' + s })
    .setAux([{ label: 'string', value: s, role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
