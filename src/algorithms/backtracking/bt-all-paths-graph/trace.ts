import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { allPaths } from './impl.ts';
export const DEFAULT_INPUT = { graph: [[1, 2], [3], [3], []], src: 0, dst: 3 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const cur: number[] = [input.src];
  rec.begin({ zh: '图所有路径 0→3', en: 'All paths 0→3' }).commit();
  allPaths(input.graph, input.src, input.dst, {
    onPush: (v) => {
      cur.push(v);
      rec
        .begin({ zh: '入 ' + v, en: 'push ' + v })
        .setBars(cur.map((x) => ({ value: x, role: 'pivot' as BarRole })))
        .commit();
    },
    onResult: (p) =>
      rec
        .begin({ zh: p.join('→'), en: p.join('→') })
        .setBars(p.map((x) => ({ value: x, role: 'final' as BarRole })))
        .commit(),
  });
  rec.begin({ zh: '完成', en: 'Done' }).commit();
  return rec.build();
}
