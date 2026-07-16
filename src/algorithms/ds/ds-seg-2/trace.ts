// =============================================================================
// 线段树 · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { SegTree2 } from './impl.ts';

export const DEFAULT_INPUT = [1, 3, 5, 7, 9, 2, 4];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const seg = new SegTree2(input);

  // 全段和
  const total = seg.query(0, input.length - 1);
  rec
    .begin({ zh: `全段和 = ${total}`, en: `Total sum = ${total}` })
    .setBars(input.map((x) => ({ value: x, role: 'default' })))
    .setAux([{ label: 'sum', value: String(total), role: 'pivot' }])
    .commit();

  // 区间加
  seg.update(1, 3, 10);
  const snap = seg.snapshot();
  rec
    .begin({ zh: '区间 [1,3] 加 10', en: 'Range [1,3] += 10' })
    .setBars(snap.map((x, i) => ({ value: x, role: i >= 1 && i <= 3 ? 'swap' : 'default' })))
    .commit();

  // 再查全段
  const total2 = seg.query(0, input.length - 1);
  rec
    .begin({ zh: `更新后全段和 = ${total2}`, en: `Updated total = ${total2}` })
    .setBars(snap.map((x) => ({ value: x, role: 'final' })))
    .setAux([{ label: 'sum', value: String(total2), role: 'final' }])
    .commit();

  return rec.build();
}
