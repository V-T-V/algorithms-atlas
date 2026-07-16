// =============================================================================
// 扩展欧几里得完整版 · 录制帧序列
// 用 setAux 展示辗转相除每轮的 (r, s)、最终 gcd 与 Bézout 系数。
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { extGcdFull, type ExGcdExtendedHooks } from './impl.ts';

export const DEFAULT_INPUT: { a: bigint; b: bigint } = { a: 240n, b: 46n };

export function buildTrace(input: { a: bigint; b: bigint } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { a, b } = input;

  let stepNo = 0;
  let g = 0n;
  let bx = 0n;
  let by = 0n;

  rec
    .begin({
      zh: `求 gcd(${a}, ${b}) 与 Bézout 系数`,
      en: `Find gcd(${a}, ${b}) and Bézout coefficients`,
    })
    .setAux([
      { label: 'a', value: a.toString(), role: 'frontier' },
      { label: 'b', value: b.toString(), role: 'frontier' },
    ])
    .commit();

  const hooks: ExGcdExtendedHooks = {
    onStep: (q, oldR, r, oldS, s) => {
      stepNo++;
      rec
        .begin({ zh: `第 ${stepNo} 轮：商 q=${q}`, en: `Round ${stepNo}: quotient q=${q}` })
        .setAux([
          { label: '商 q', value: q.toString(), role: 'compare' },
          { label: 'old_r', value: oldR.toString(), role: 'default' },
          { label: 'r', value: r.toString(), role: 'default' },
          { label: 'old_s', value: oldS.toString(), role: 'default' },
          { label: 's', value: s.toString(), role: 'default' },
        ])
        .commit();
    },
    onDone: (gg, x, y) => {
      g = gg;
      bx = x;
      by = y;
    },
  };

  extGcdFull(a, b, hooks);

  rec
    .begin({
      zh: `完成：gcd = ${g}，${a}·(${bx}) + ${b}·(${by}) = ${g}`,
      en: `Done: gcd = ${g}, ${a}·(${bx}) + ${b}·(${by}) = ${g}`,
    })
    .setAux([
      { label: 'gcd', value: g.toString(), role: 'final' },
      { label: 'Bézout x', value: bx.toString(), role: 'final' },
      { label: 'Bézout y', value: by.toString(), role: 'final' },
    ])
    .commit();

  return rec.build();
}
