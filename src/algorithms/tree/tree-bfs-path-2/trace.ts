import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, pathToNode } from './impl.ts';
export const DEFAULT_INPUT = { arr: [1, 2, 3, 4, 5], target: 5 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input.arr);
  rec.begin({ zh: '路径到 ' + input.target, en: 'Path to ' + input.target }).commit();
  const p = pathToNode(root, input.target, {
    onVisit: (v) =>
      rec
        .begin({ zh: '访问 ' + v, en: 'visit ' + v })
        .setAux([{ label: 'node', value: String(v), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({
      zh: '路径：' + (p?.join(' → ') ?? '未找到'),
      en: 'Path: ' + (p?.join(' → ') ?? 'not found'),
    })
    .setBars((p ?? []).map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();
  return rec.build();
}
