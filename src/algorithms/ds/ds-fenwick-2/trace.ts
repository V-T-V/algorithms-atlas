// =============================================================================
// Fenwick · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Fenwick2 } from './impl.ts';

export const DEFAULT_INPUT = [2, 4, 1, 7, 3, 9, 5];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  const bit = new Fenwick2(n, input);

  rec
    .begin({ zh: '构建完成', en: 'Build done' })
    .setBars(input.map((x) => ({ value: x, role: 'default' })))
    .commit();

  // 演示前缀和
  const p3 = bit.prefix(3);
  rec
    .begin({ zh: `prefix(3) = ${p3}`, en: `prefix(3) = ${p3}` })
    .setBars(input.map((x, i) => ({ value: x, role: i < 3 ? 'compare' : 'default' })))
    .setAux([{ label: 'prefix(3)', value: String(p3), role: 'pivot' }])
    .commit();

  // 单点加
  bit.update(4, 10);
  const snap = input.slice();
  snap[3] = snap[3]! + 10;
  rec
    .begin({ zh: '位置 4 加 10', en: 'Position 4 += 10' })
    .setBars(snap.map((x, i) => ({ value: x, role: i === 3 ? 'swap' : 'default' })))
    .commit();

  const r = bit.range(2, 5);
  rec
    .begin({ zh: `区间和 [2,5] = ${r}`, en: `range[2,5] = ${r}` })
    .setBars(
      snap.map((x, i) => {
        const idx = i + 1;
        return { value: x, role: idx >= 2 && idx <= 5 ? 'final' : 'default' };
      }),
    )
    .setAux([{ label: 'range[2,5]', value: String(r), role: 'final' }])
    .commit();

  return rec.build();
}
