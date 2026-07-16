import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildFromInPost } from './impl.ts';
export const DEFAULT_INPUT = { in: [9, 3, 15, 20, 7], post: [9, 15, 7, 20, 3] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '中序+后序重建', en: 'Build from in+post' }).commit();
  const root = buildFromInPost(input.in, input.post, {
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
