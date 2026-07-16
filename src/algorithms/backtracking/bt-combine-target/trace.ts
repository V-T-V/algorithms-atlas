// 组合目标和 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { btCombineTarget, type BtCombineTargetHooks } from './impl.ts';

export const DEFAULT_INPUT = { candidates: [2, 3, 6, 7], target: 7 };

export function buildTrace(
  input: { candidates: number[]; target: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { candidates, target } = input;
  let count = 0;

  rec
    .begin({
      zh: `候选 [${candidates.join(', ')}]，目标 ${target}`,
      en: `Candidates [${candidates.join(', ')}], target ${target}`,
    })
    .setAux([{ label: 'target', value: String(target), role: 'pivot' }])
    .commit();

  const hooks: BtCombineTargetHooks = {
    onCombo: (c) => {
      count++;
      rec
        .begin({
          zh: `命中：[${c.join('+')}] = ${target}`,
          en: `Hit: [${c.join('+')}] = ${target}`,
        })
        .setBars(c.map((v) => ({ value: v, role: 'final' as BarRole })))
        .setAux([
          { label: 'sum', value: String(c.reduce((a, b) => a + b, 0)), role: 'final' },
          { label: 'count', value: String(count), role: 'final' },
        ])
        .commit();
    },
  };

  const result = btCombineTarget(candidates, target, hooks);

  rec
    .begin({
      zh: `完成：${result.length} 组合`,
      en: `Done: ${result.length} combinations`,
    })
    .setAux([{ label: '总数', value: String(result.length), role: 'final' }])
    .commit();

  return rec.build();
}
