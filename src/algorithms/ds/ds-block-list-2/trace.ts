// =============================================================================
// 分块数组 · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { BlockList2 } from './impl.ts';

export const DEFAULT_INPUT = [1, 3, 5, 7, 9, 2, 4, 6, 8, 0];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const bl = new BlockList2(input);

  rec
    .begin({ zh: `分块完成，块大小=${bl.blockSize}`, en: `Blocked, size=${bl.blockSize}` })
    .setBars(input.map((x) => ({ value: x, role: 'default' })))
    .setAux([
      { label: 'blockSize', value: String(bl.blockSize), role: 'frontier' },
      { label: 'blockCount', value: String(bl.blockCount), role: 'frontier' },
    ])
    .commit();

  bl.update(1, 8, 10);
  const snap1 = bl.snapshot();
  rec
    .begin({ zh: '区间 [1,8] 加 10', en: 'Range [1,8] += 10' })
    .setBars(
      snap1.map((x, i) => ({
        value: x,
        role: i >= 1 && i <= 8 ? 'swap' : 'default',
      })),
    )
    .commit();

  const q = bl.query(2, 6);
  rec
    .begin({ zh: `区间 [2,6] 和 = ${q}`, en: `Range [2,6] sum = ${q}` })
    .setBars(
      snap1.map((x, i) => ({
        value: x,
        role: i >= 2 && i <= 6 ? 'compare' : 'default',
      })),
    )
    .setAux([{ label: 'sum', value: String(q), role: 'final' }])
    .commit();

  return rec.build();
}
