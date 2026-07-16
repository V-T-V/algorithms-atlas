// =============================================================================
// Pell 方程 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { solvePell, type PellHooks } from './impl.ts';

export const DEFAULT_INPUT: { D: bigint } = { D: 13n };

export function buildTrace(input: { D: number | bigint } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const D = typeof input.D === 'number' ? BigInt(input.D) : input.D;

  const terms: number[] = [];
  let ansX = 0n;
  let ansY = 0n;

  rec
    .begin({
      zh: `求 x² − ${D}·y² = 1 的最小正解`,
      en: `Solve x² − ${D}·y² = 1 (minimal positive solution)`,
    })
    .setAux([{ label: 'D', value: D.toString(), role: 'frontier' }])
    .commit();

  const hooks: PellHooks = {
    onTerm: (a) => {
      terms.push(Number(a));
      rec
        .begin({
          zh: `连分数项 a = ${a}（已展开：[${terms.join(', ')}]）`,
          en: `CF term a = ${a} (so far: [${terms.join(', ')}])`,
        })
        .setAux([{ label: '连分数', value: terms.join(', '), role: 'compare' }])
        .commit();
    },
    onConvergent: (h, k) => {
      const lhs = h * h - D * k * k;
      rec
        .begin({
          zh: `收敛子 ${h}/${k}：${h}² − ${D}·${k}² = ${lhs}`,
          en: `Convergent ${h}/${k}: ${h}² − ${D}·${k}² = ${lhs}`,
        })
        .setAux([
          { label: 'h', value: h.toString(), role: 'frontier' },
          { label: 'k', value: k.toString(), role: 'frontier' },
          { label: 'h²−Dk²', value: lhs.toString(), role: lhs === 1n ? 'final' : 'default' },
        ])
        .commit();
    },
  };

  const { x, y } = solvePell(D, hooks);
  ansX = x;
  ansY = y;

  rec
    .begin({
      zh: `基础解 x=${ansX}, y=${ansY}（验证 ${ansX}²−${D}·${ansY}²=${ansX * ansX - D * ansY * ansY}）`,
      en: `Fundamental solution x=${ansX}, y=${ansY} (verify ${ansX}²−${D}·${ansY}²=${ansX * ansX - D * ansY * ansY})`,
    })
    .setAux([
      { label: 'x', value: ansX.toString(), role: 'final' },
      { label: 'y', value: ansY.toString(), role: 'final' },
    ])
    .commit();

  return rec.build();
}
