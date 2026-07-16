// 矩形分配问题 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rectangularAssignment } from './impl.ts';

export const DEFAULT_INPUT = [
  [4, 1, 3],
  [2, 5, 8],
  [6, 3, 2],
  [7, 9, 4],
];

export function buildTrace(input: ReadonlyArray<ReadonlyArray<number>> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const result = rectangularAssignment(input);

  rec
    .begin({
      zh: `${input.length}×${input[0]!.length} 矩形代价矩阵`,
      en: `${input.length}x${input[0]!.length} rectangular cost matrix`,
    })
    .setAux([
      { label: 'shape', value: `${input.length}x${input[0]!.length}`, role: 'pivot' as BarRole },
    ])
    .commit();

  rec
    .begin({
      zh: `最小总代价 = ${result.totalCost}`,
      en: `Minimum total cost = ${result.totalCost}`,
    })
    .setAux(
      result.pairs.map((p) => ({
        label: `工${p.worker}`,
        value: `→任${p.task} (${p.cost})`,
        role: 'final' as BarRole,
      })),
    )
    .commit();
  return rec.build();
}
