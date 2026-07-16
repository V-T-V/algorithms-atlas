// =============================================================================
// 第二类 Stirling 数（显式公式）· 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { stirlingNumber2, type StirlingNumber2Hooks } from './impl.ts';

export const DEFAULT_INPUT: { n: number; k: number } = { n: 8, k: 3 };

export function buildTrace(input: { n: number; k: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n, k } = input;

  const terms: Array<{ j: string; term: string }> = [];

  rec
    .begin({
      zh: `计算 S(${n}, ${k})：把 ${n} 个元素分到 ${k} 个非空集合`,
      en: `Compute S(${n}, ${k}): partition ${n} elements into ${k} nonempty sets`,
    })
    .setAux([
      { label: 'n', value: String(n), role: 'frontier' },
      { label: 'k', value: String(k), role: 'frontier' },
    ])
    .commit();

  const hooks: StirlingNumber2Hooks = {
    onTerm: (j, term) => {
      terms.push({ j: String(j), term: term.toString() });
      rec
        .begin({
          zh: `第 ${j} 项：(−1)^${j}·C(${k},${j})·(${k}−${j})^${n} = ${term}`,
          en: `Term ${j}: (−1)^${j}·C(${k},${j})·(${k}−${j})^${n} = ${term}`,
        })
        .setAux(
          terms.map((t, i) => ({
            label: `j=${t.j}`,
            value: t.term,
            role: i === terms.length - 1 ? 'compare' : 'default',
          })),
        )
        .commit();
    },
  };

  const ans = stirlingNumber2(n, k, hooks);

  rec
    .begin({ zh: `S(${n}, ${k}) = ${ans}`, en: `S(${n}, ${k}) = ${ans}` })
    .setAux([{ label: '答案', value: ans.toString(), role: 'final' }])
    .commit();

  return rec.build();
}
