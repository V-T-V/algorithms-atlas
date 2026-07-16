import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildFromPreIn } from './impl.ts';
export const DEFAULT_INPUT = { pre: [3, 9, 20, 15, 7], in: [9, 3, 15, 20, 7] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '前序+中序重建', en: 'Build from pre+in' }).commit();
  const root = buildFromPreIn(input.pre, input.in, {
    onCreate: (v) =>
      rec
        .begin({ zh: '创建节点 ' + v, en: 'create ' + v })
        .setAux([{ label: 'create', value: String(v), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '根 = ' + (root?.value ?? null), en: 'root = ' + (root?.value ?? null) })
    .setAux([{ label: 'root', value: String(root?.value ?? null), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
