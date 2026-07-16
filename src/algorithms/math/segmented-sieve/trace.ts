// =============================================================================
// 分段筛 · 录制帧序列
// 演示筛 [L, R]，用 setAux 展示每段的素数累计。
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { segmentedSieve, type SegmentedSieveHooks } from './impl.ts';

export const DEFAULT_INPUT: { L: number; R: number } = { L: 50, R: 100 };

export function buildTrace(input: { L: number; R: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { L, R } = input;

  const found: number[] = [];
  let segRange = '';

  rec
    .begin({ zh: `分段筛 [${L}, ${R}]`, en: `Segmented sieve [${L}, ${R}]` })
    .setAux([
      { label: 'L', value: String(L), role: 'frontier' },
      { label: 'R', value: String(R), role: 'frontier' },
    ])
    .commit();

  const hooks: SegmentedSieveHooks = {
    onBaseSieve: (bp) => {
      rec
        .begin({
          zh: `筛出基础素数（≤√R）：${bp.join(', ')}`,
          en: `Base primes (≤√R): ${bp.join(', ')}`,
        })
        .setAux([{ label: '基础素数', value: bp.join(', '), role: 'compare' }])
        .commit();
    },
    onSegment: (sL, sR) => {
      segRange = `[${sL}, ${sR}]`;
      rec
        .begin({ zh: `处理段 ${segRange}`, en: `Processing segment ${segRange}` })
        .setAux([
          { label: '当前段', value: segRange, role: 'frontier' },
          { label: '已找到', value: found.join(', ') || '（无）', role: 'default' },
        ])
        .commit();
    },
    onPrime: (x) => {
      found.push(x);
    },
  };

  segmentedSieve(L, R, hooks);

  rec
    .begin({ zh: `完成：共 ${found.length} 个素数`, en: `Done: ${found.length} primes` })
    .setAux([{ label: '素数', value: found.join(', '), role: 'final' }])
    .commit();

  return rec.build();
}
