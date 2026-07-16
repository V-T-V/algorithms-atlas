// =============================================================================
// 组合数 · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Combinatorics } from './impl.ts';

export const DEFAULT_INPUT = {
  N: 10,
  queries: [
    [5, 2],
    [6, 3],
    [7, 0],
    [4, 4],
    [10, 5],
  ] as Array<[number, number]>,
};

export function buildTrace(
  input: { N: number; queries: Array<[number, number]> } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const comb = new Combinatorics(input.N);
  const results: Array<{ n: number; k: number; v: string }> = [];

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(results.map((r) => ({ value: Number(r.v), role: 'frontier' })))
      .setAux(results.map((r) => ({ label: `C(${r.n},${r.k})`, value: r.v, role: 'final' })))
      .commit();
  };

  snap({ zh: `预处理 0..${input.N} 的阶乘与逆元`, en: `Precompute 0..${input.N}` });

  for (const [n, k] of input.queries) {
    const v = comb.choose(n, k);
    results.push({ n, k, v: v.toString() });
    snap({ zh: `C(${n},${k}) = ${v}`, en: `C(${n},${k}) = ${v}` });
  }

  rec
    .begin({ zh: `共 ${results.length} 次查询`, en: `${results.length} queries` })
    .setAux(results.map((r) => ({ label: `C(${r.n},${r.k})`, value: r.v, role: 'final' })))
    .commit();

  return rec.build();
}
