// =============================================================================
// 欧拉筛完整版 · 录制帧序列
// 用 setAux 展示已发现的素数，setArray 展示 lpf 表的当前状态。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { eulerSieveFull, type EulerSieveFullHooks } from './impl.ts';

export const DEFAULT_INPUT: { n: number } = { n: 20 };

export function buildTrace(input: { n: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n } = input;

  const lpf = new Array<number>(n + 1).fill(0);
  const primesFound: number[] = [];
  let lastMarked = -1;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = new Array(n + 1).fill('default');
    for (const p of primesFound) if (p <= n) roles[p] = 'sorted';
    if (lastMarked >= 0 && lastMarked <= n) roles[lastMarked] = 'warn';
    const pointers: Array<{ index: number; label: string }> = [];
    if (lastMarked >= 0) pointers.push({ index: lastMarked, label: 'c' });
    rec
      .begin(note)
      .setArray(lpf, roles, pointers)
      .setAux([{ label: '已发现素数', value: primesFound.join(', ') || '（无）', role: 'final' }])
      .commit();
    lastMarked = -1;
  };

  snapshot({
    zh: `欧拉筛 [2, ${n}]，lpf 初始全 0`,
    en: `Euler sieve [2, ${n}], lpf initialized to 0`,
  });

  const hooks: EulerSieveFullHooks = {
    onPrime: (p) => {
      primesFound.push(p);
    },
    onMark: (c, i, p) => {
      lpf[c] = p;
      lastMarked = c;
      snapshot({
        zh: `${i} · ${p} = ${c}，lpf[${c}] = ${p}`,
        en: `${i} · ${p} = ${c}, lpf[${c}] = ${p}`,
      });
    },
  };

  eulerSieveFull(n, hooks);

  rec
    .begin({
      zh: `完成：共 ${primesFound.length} 个素数`,
      en: `Done: ${primesFound.length} primes found`,
    })
    .setAux([{ label: '素数', value: primesFound.join(', '), role: 'final' }])
    .commit();

  return rec.build();
}
