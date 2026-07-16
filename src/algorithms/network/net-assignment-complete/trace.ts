// 完全分配问题 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { completeAssignment } from './impl.ts';

export const DEFAULT_INPUT = [
  [9, 2, 7],
  [6, 4, 3],
  [5, 8, 1],
];

export function buildTrace(input: ReadonlyArray<ReadonlyArray<number>> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const result = completeAssignment(input);

  rec
    .begin({
      zh: `${input.length}×${input.length} 代价方阵`,
      en: `${input.length}x${input.length} cost matrix`,
    })
    .setAux(
      input.flatMap((row, i) =>
        row.map((c, j) => ({ label: `[${i},${j}]`, value: String(c), role: 'default' as BarRole })),
      ),
    )
    .commit();

  rec
    .begin({
      zh: `最小总代价 = ${result.totalCost}`,
      en: `Minimum total cost = ${result.totalCost}`,
    })
    .setAux(
      result.assignment.map((j, i) => ({
        label: `工${i}`,
        value: `→任${j} (${input[i]![j]!})`,
        role: 'final' as BarRole,
      })),
    )
    .commit();
  return rec.build();
}
