import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pathSum, type TNode } from './impl.ts';
export const DEFAULT_INPUT = {
  root: {
    val: 5,
    left: {
      val: 4,
      left: {
        val: 11,
        left: { val: 7, left: null, right: null },
        right: { val: 2, left: null, right: null },
      },
      right: null,
    },
    right: {
      val: 8,
      left: { val: 13, left: null, right: null },
      right: {
        val: 4,
        left: { val: 5, left: null, right: null },
        right: { val: 1, left: null, right: null },
      },
    },
  } as TNode,
  target: 22,
};
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const cur: number[] = [];
  rec.begin({ zh: '路径和 = ' + input.target, en: 'Sum = ' + input.target }).commit();
  pathSum(input.root, input.target, {
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
