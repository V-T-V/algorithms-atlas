// =============================================================================
// Subsets II · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { btSubsetWithDup, type BtSubsetWithDupHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 2];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const chosen: number[] = [];
  let count = 0;

  rec
    .begin({
      zh: `枚举 [${input.join(', ')}] 的去重子集`,
      en: `Deduplicated subsets of [${input.join(', ')}]`,
    })
    .setBars([])
    .setAux([{ label: 'chosen', value: '∅', role: 'default' }])
    .commit();

  const hooks: BtSubsetWithDupHooks = {
    onSubset: (subset) => {
      count++;
      rec
        .begin({
          zh: `子集：{ ${subset.join(', ')} }`,
          en: `Subset: { ${subset.join(', ')} }`,
        })
        .setBars(subset.map((v) => ({ value: v, role: 'final' as BarRole })))
        .setAux([
          { label: 'chosen', value: subset.length ? subset.join(', ') : '∅', role: 'pivot' },
          { label: 'count', value: String(count), role: 'final' },
        ])
        .commit();
    },
    onSkipDup: (index) => {
      rec
        .begin({
          zh: `跳过下标 ${index}（与前一个相等，去重）`,
          en: `Skip index ${index} (equal to prev, dedup)`,
        })
        .setBars(chosen.map((v) => ({ value: v, role: 'warn' as BarRole })))
        .setAux([{ label: 'chosen', value: chosen.join(', ') || '∅', role: 'default' }])
        .commit();
    },
  };

  const result = btSubsetWithDup(input, hooks);

  rec
    .begin({ zh: `完成：共 ${result.length} 个子集`, en: `Done: ${result.length} subsets` })
    .setBars(input.map((v) => ({ value: v, role: 'final' as BarRole })))
    .setAux([{ label: '总数', value: String(result.length), role: 'final' }])
    .commit();

  return rec.build();
}
