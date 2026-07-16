// =============================================================================
// 二次剩余 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { enumerateResidues, type QuadraticResidueHooks } from './impl.ts';

export const DEFAULT_INPUT: { p: bigint } = { p: 13n };

export function buildTrace(input: { p: number | bigint } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const p = typeof input.p === 'number' ? BigInt(input.p) : input.p;

  const squares = new Array<number>(Number(p)).fill(0);
  const seen: number[] = [];

  rec
    .begin({ zh: `枚举模 ${p} 的二次剩余`, en: `Enumerate quadratic residues mod ${p}` })
    .setAux([{ label: 'p', value: p.toString(), role: 'frontier' }])
    .commit();

  const hooks: QuadraticResidueHooks = {
    onSquare: (x, r) => {
      squares[Number(x)] = Number(r);
      seen.push(Number(r));
      const roles: BarRole[] = new Array(Number(p)).fill('default');
      for (const s of seen) if (s < Number(p)) roles[s] = 'final';
      roles[Number(x)] = 'compare';
      rec
        .begin({ zh: `${x}² mod ${p} = ${r}`, en: `${x}² mod ${p} = ${r}` })
        .setArray(squares, roles, [{ index: Number(x), label: 'x' }])
        .commit();
    },
  };

  const residues = enumerateResidues(p, hooks);

  rec
    .begin({
      zh: `二次剩余集合 = {${residues.join(', ')}}`,
      en: `Residues = {${residues.join(', ')}}`,
    })
    .setAux([{ label: '剩余', value: residues.join(', '), role: 'final' }])
    .commit();

  return rec.build();
}
