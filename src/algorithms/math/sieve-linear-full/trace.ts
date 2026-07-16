// =============================================================================
// 线性筛完整版 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { linearSieveFull, type LinearSieveFullHooks } from './impl.ts';

export const DEFAULT_INPUT: { n: number } = { n: 16 };

export function buildTrace(input: { n: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n } = input;

  const phi = new Array<number>(Math.max(1, n + 1)).fill(0);
  phi[1] = 1;
  const primesFound: number[] = [];

  const snapshot = (note: { zh: string; en: string }, highlightIdx: number[] = []): void => {
    const roles: BarRole[] = new Array(n + 1).fill('default');
    for (const p of primesFound) if (p <= n) roles[p] = 'sorted';
    for (const idx of highlightIdx) if (idx >= 0 && idx <= n) roles[idx] = 'warn';
    rec
      .begin(note)
      .setArray(
        phi,
        roles,
        highlightIdx.map((index) => ({ index, label: 'φ' })),
      )
      .setAux([{ label: '素数', value: primesFound.join(', ') || '（无）', role: 'final' }])
      .commit();
  };

  snapshot({ zh: `线性筛 [2, ${n}]，φ[1]=1`, en: `Linear sieve [2, ${n}], φ[1]=1` });

  const hooks: LinearSieveFullHooks = {
    onPrime: (p) => {
      primesFound.push(p);
    },
    onMark: (c, i, p, divides) => {
      snapshot(
        {
          zh: `φ[${c}] = φ[${i}]·${divides ? p : `(p-1)=${p - 1}`}`,
          en: `φ[${c}] = φ[${i}]·${divides ? p : `(p-1)=${p - 1}`}`,
        },
        [c],
      );
    },
  };

  linearSieveFull(n, hooks);

  rec
    .begin({ zh: `完成：${primesFound.length} 个素数`, en: `Done: ${primesFound.length} primes` })
    .setAux([{ label: '素数', value: primesFound.join(', '), role: 'final' }])
    .commit();

  return rec.build();
}
